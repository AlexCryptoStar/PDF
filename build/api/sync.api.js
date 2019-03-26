"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfreader_1 = require("pdfreader");
const rxjs_1 = require("rxjs");
const jsdom_1 = require("jsdom");
const http = require("http");
const fs = require("fs");
const formidable_1 = require("formidable");
const c_1 = require("../c");
const sync_models_1 = require("../models/sync.models");
class SyncApi {
    constructor(connection, wss) {
        this.lastWsSyncMessage = null;
        this.lastWsUploadMessage = null;
        this.db = connection;
        this.wss = wss;
        this.syncCertificates = this.syncCertificates.bind(this);
        this.uploadContracts = this.uploadContracts.bind(this);
        wss.on('connection', (ws) => {
            ws.send(this.lastWsSyncMessage || JSON.stringify({
                type: 'SYNC_BLANK',
            }));
            ws.send(this.lastWsUploadMessage || JSON.stringify({
                type: 'UPLOAD_BLANK',
            }));
        });
    }
    uploadContracts(req, res) {
        console.log('SyncApi.uploadContracts()');
        const broadcastMsg = (msg) => {
            this.lastWsUploadMessage = msg;
            this.wss.clients.forEach(ws => {
                try {
                    ws.send(msg);
                }
                catch (err) {
                    console.log('failed to send ws message', err);
                }
            });
        };
        const broadcastState = (...states) => broadcastMsg(JSON.stringify({
            type: 'UPLOAD_PROGRESS',
            results: states
        }));
        const parseContactName = (name) => parseInt(name.slice(0, -4));
        const upload$ = rxjs_1.Observable.create((observer) => {
            const form = new formidable_1.IncomingForm();
            form.uploadDir = '/tmp';
            form.maxFileSize = 1024 * 1024 * 1024 * 1024;
            form.maxFields = 0;
            form.maxFieldsSize = 1024 * 1024 * 1024 * 1024;
            const onError = (error) => {
                console.error('onError()', error);
                if (!observer.closed) {
                    broadcastMsg(JSON.stringify({
                        type: 'UPLOAD_ERROR',
                        error,
                    }));
                    observer.error(error);
                }
            };
            req.on('error', onError);
            req.connection.removeAllListeners();
            req.connection.on('error', onError);
            form.on('aborted', onError);
            form.on('error', onError);
            form.on('fileBegin', (name) => {
                console.log('uploading file', name);
                broadcastState(new sync_models_1.UploadState(parseContactName(name), sync_models_1.UploadPhase.UPLOADIN_PDF));
            });
            form.on('file', (name, file) => {
                console.log('file uploaded', name, file.path);
                observer.next({ timestamp: parseContactName(name), file });
            });
            form.on('end', () => {
                console.log('all files uploaded');
                observer.complete();
                res.send({ status: 'UPLOAD_COMPLETE' });
            });
            form.parse(req);
        });
        upload$
            .timeout(60 * 60000)
            .flatMap(entry => rxjs_1.Observable.of(entry)
            .do(_ => broadcastState(new sync_models_1.UploadState(entry.timestamp, sync_models_1.UploadPhase.PARSING_PDF)))
            .flatMap(_ => this.parsePdf(entry.file.path))
            .do(_ => fs.unlink(entry.file.path, () => null))
            .do(_ => broadcastState(new sync_models_1.UploadState(entry.timestamp, sync_models_1.UploadPhase.STORING_DATA)))
            .flatMap(pdfText => this.storeContract(entry.timestamp, pdfText.text))
            .mapTo(new sync_models_1.UploadState(entry.timestamp, sync_models_1.UploadPhase.COMPLETE))
            .timeout(60000)
            ._catch(error => {
            console.log('_catch()', entry, error);
            if (error instanceof sync_models_1.UploadState)
                return rxjs_1.Observable.of(error);
            if (error.name == 'TimeoutError')
                return rxjs_1.Observable.of(new sync_models_1.UploadState(entry.timestamp, sync_models_1.UploadPhase.TIMEOUT_ERROR));
            return rxjs_1.Observable.of(new sync_models_1.UploadState(entry.timestamp, sync_models_1.UploadPhase.ERROR));
        })
            .do(state => broadcastState(state)), c_1.C.MAX_PARALLEL_SYNCS)
            .toArray()
            .delay(1000)
            .subscribe((results) => {
            console.log('upload done');
            broadcastMsg(JSON.stringify({
                type: 'UPLOAD_COMPLETE',
                results,
            }));
        }, (error) => {
            console.error(error);
            broadcastMsg(JSON.stringify({
                type: 'UPLOAD_ERROR',
                error,
            }));
        });
    }
    syncCertificates(req, res) {
        console.log('SyncApi.syncCertificates()', req.body);
        const numbers = req.body.numbers;
        const broadcastMsg = (msg) => {
            this.lastWsSyncMessage = msg;
            this.wss.clients.forEach(ws => {
                try {
                    ws.send(msg);
                }
                catch (err) {
                    console.log('failed to send ws message', err);
                }
            });
        };
        const broadcastState = (state) => broadcastMsg(JSON.stringify({
            type: 'SYNC_PROGRESS',
            numbers,
            results: [state]
        }));
        rxjs_1.Observable.from(numbers)
            .flatMap(number => rxjs_1.Observable.of(number)
            .do(_ => broadcastState(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.PARSING_WEBPAGE)))
            .flatMapTo(this.parseWebpage(number)
            .do(_ => broadcastState(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.DOWNLOADIN_PDF)))
            .flatMap(certificate => this.downloadPdf(certificate.downloadPdfUri, number)
            .do(_ => broadcastState(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.PARSING_PDF)))
            .flatMap(path => this.parsePdf(path, true)
            .do(_ => fs.unlink(path, () => null)))
            .do(_ => broadcastState(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.STORING_DATA)))
            .flatMap(pdfText => this.storeCertificate(certificate, pdfText))
            .mapTo(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.COMPLETE))))
            .timeout(60000)
            ._catch(error => {
            console.log('_catch()', number, error);
            if (error instanceof sync_models_1.SyncState)
                return rxjs_1.Observable.of(error);
            if (error.name === 'RequestError' || error.errno == 'ENOTFOUND')
                return rxjs_1.Observable.of(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.CONNECTION_PROBLEMS));
            if (error.name == 'TimeoutError')
                return rxjs_1.Observable.of(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.TIMEOUT_ERROR));
            return rxjs_1.Observable.of(new sync_models_1.SyncState(number, sync_models_1.SyncPhase.ERROR));
        })
            .do(state => broadcastState(state)), c_1.C.MAX_PARALLEL_SYNCS)
            .toArray()
            .delay(1000) // loading progress after finish. race condition?
            .subscribe((results) => {
            console.log('sync done');
            broadcastMsg(JSON.stringify({
                type: 'SYNC_COMPLETE',
                numbers,
                results,
            }));
        }, (error) => {
            console.error(error);
            broadcastMsg(JSON.stringify({
                type: 'SYNC_ERROR',
                numbers,
                error,
            }));
        });
        res.send({ status: 'RUNNING' });
    }
    parseWebpage(contractNumber) {
        console.log('SyncApi.parseWebpage()', contractNumber);
        const webpageUri = c_1.C.CERTIFICATE_WEBPAGE_URI_TEMPLATE + contractNumber;
        return rxjs_1.Observable.from(jsdom_1.JSDOM.fromURL(webpageUri))
            .map(dom => {
            const form = dom.window.document.getElementsByName('tLfqmForm').item(0);
            const rows = form.getElementsByTagName('table').item(2)
                .getElementsByTagName('tr');
            if (rows.length == 2)
                throw new sync_models_1.SyncState(contractNumber, sync_models_1.SyncPhase.DOCUMENT_NOT_FOUND);
            const cells = rows.item(rows.length - 2).getElementsByTagName('td');
            const pdfUriScript = cells.item(6).children.item(0).attributes.getNamedItem('onclick').value;
            const pdfUri = pdfUriScript.substring('javascript:goViewAction1("'.length, pdfUriScript.length - 2);
            const certificate = {
                contractNumber,
                certificateNumber: cells.item(2).innerHTML.trim(),
                collectionMethod: cells.item(3).innerHTML.trim(),
                syncDate: new Date(),
                issueDate: cells.item(4).innerHTML.trim(),
                deliveryDate: cells.item(5).innerHTML.trim(),
                webpageUri,
                viewPdfUri: c_1.C.VIEW_CERTIFICATE_PDF_URI_TEMPLATE + pdfUri,
                downloadPdfUri: c_1.C.DOWNLOAD_CERTIFICATE_PDF_URI_TEMPLATE + pdfUri,
            };
            return certificate;
        });
    }
    downloadPdf(uri, contractNumber) {
        console.log('SyncApi.downloadPdf()', uri);
        return rxjs_1.Observable.create((observer) => {
            const filePath = `/tmp/${contractNumber}.pdf`;
            const file = fs.createWriteStream(filePath);
            http.get(uri, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    observer.next(filePath);
                    observer.complete();
                });
                file.on('error', (error) => {
                    file.close();
                    console.error('downloading pdf failed', error);
                    observer.error(error);
                });
            });
            return () => null;
        });
    }
    parsePdf(path, readSpecs = false) {
        console.log('SyncApi.parsePdf()', path);
        return rxjs_1.Observable.create((observer) => {
            try {
                const reader = new pdfreader_1.PdfReader();
                const text = new Array(), productZh = new Array(), productEn = new Array(), specification = new Map(), purchaser = new Array(), dimension = new Array(), totalPcs = new Array(), totalWeight = new Array();
                let page = 0;
                reader.parseFileItems(path, (error, data) => {
                    if (error) {
                        console.error('parsing pdf failed', error);
                        observer.error(error);
                        return;
                    }
                    if (!data || !data.file && !data.page && !data.text) {
                        const content = { text: text.join(' ') };
                        if (productZh.length && productEn.length && specification.size
                            && purchaser.length && dimension.length && totalPcs.length
                            && totalWeight.length) {
                            content.specs = {
                                productZh: productZh.join(' '),
                                productEn: productEn.join(' '),
                                specifications: Array.from(specification.values())
                                    .map(items => items.join(' '))
                                    .join('\n'),
                                purchaser: purchaser.join(' '),
                                dimension: dimension.join(' '),
                                totalPcs: totalPcs.join(' '),
                                totalWeight: totalWeight.join(' '),
                            };
                        }
                        observer.next(content);
                        observer.complete();
                    }
                    if (data.page)
                        page++;
                    if (data.text) {
                        if (readSpecs && page === 1) {
                            const x = Math.round(parseFloat(data.x) * 100) / 100;
                            const y = Math.round(parseFloat(data.y) * 100) / 100;
                            if (x >= 91.36 && y === 5.66)
                                productZh.push(data.text);
                            if (x >= 91.36 && y === 6.09)
                                productEn.push(data.text);
                            if (x >= 19.69 && x < 70 && y === 7.09)
                                purchaser.push(data.text);
                            if (x >= 19.86 && x < 70 && y >= 8.09 && y < 12)
                                if (specification.has(y))
                                    specification.get(y).push(data.text);
                                else
                                    specification.set(y, [data.text]);
                            if (x >= 17.8 && x < 36 && y === 12.19)
                                dimension.push(data.text);
                            if (x >= 51.31 && x < 67 && y === 12.84)
                                totalPcs.push(data.text);
                            if (x >= 118.34 && y === 12.81)
                                totalWeight.push(data.text);
                        }
                        text.push(data.text);
                    }
                });
            }
            catch (error) {
                console.error('catched parsing pdf error', error);
                observer.error(error);
            }
            return () => null;
        });
    }
    releaseSafe(connection) {
        try {
            connection.release();
        }
        catch (e) {
            console.error('failed to release connection', e);
        }
    }
    storeCertificate(certificate, pdfContent) {
        console.log('SyncApi.storeCertificate()', certificate.contractNumber);
        return rxjs_1.Observable.create((observer) => {
            this.db.getConnection((error, connection) => {
                if (error) {
                    console.error('failed to get pool connection', error);
                    return observer.error(error);
                }
                connection.query('SELECT id FROM certificates WHERE contract_number = ?', [certificate.contractNumber], (error, results) => {
                    if (error) {
                        this.releaseSafe(connection);
                        console.error('failed to run sql query', error);
                        return observer.error(error);
                    }
                    const complete = (certId) => {
                        this.releaseSafe(connection);
                        observer.next(certId);
                        observer.complete();
                    };
                    const updateSpecs = (certId) => {
                        if (!pdfContent.specs)
                            return complete(certId);
                        connection.query('DELETE FROM certificate_specs WHERE id = ?', [certId], (error) => {
                            if (error) {
                                this.releaseSafe(connection);
                                console.error('failed to run sql query', error);
                                return observer.error(error);
                            }
                            connection.query('INSERT INTO certificate_specs values' +
                                ' (?, ?, ?, ?, ?, ?, ?, ?)', [
                                certId,
                                pdfContent.specs.productZh,
                                pdfContent.specs.productEn,
                                pdfContent.specs.purchaser,
                                pdfContent.specs.specifications,
                                pdfContent.specs.dimension,
                                pdfContent.specs.totalPcs,
                                pdfContent.specs.totalWeight,
                            ], (error) => {
                                if (error) {
                                    this.releaseSafe(connection);
                                    console.error('failed to run sql query', error);
                                    return observer.error(error);
                                }
                                complete(certId);
                            });
                        });
                    };
                    const queryArgs = [
                        certificate.contractNumber,
                        certificate.certificateNumber,
                        certificate.collectionMethod,
                        certificate.syncDate,
                        certificate.issueDate,
                        certificate.deliveryDate,
                        certificate.webpageUri,
                        certificate.viewPdfUri,
                        certificate.downloadPdfUri,
                        pdfContent.text,
                        pdfContent.specs != undefined,
                    ];
                    if (results.length > 0) {
                        connection.query('UPDATE certificates SET' +
                            ' contract_number = ?,' +
                            ' certificate_number = ?,' +
                            ' collection_method = ?,' +
                            ' sync_date = ?,' +
                            ' issue_date = ?,' +
                            ' delivery_date = ?,' +
                            ' webpage_uri = ?,' +
                            ' view_pdf_uri = ?,' +
                            ' download_pdf_uri = ?,' +
                            ' pdf_text = ?,' +
                            ' specs = ?' +
                            ' WHERE ID = ?', queryArgs.concat(results[0].id), (error) => {
                            if (error) {
                                console.error('failed to run sql query', error);
                                return observer.error(error);
                            }
                            updateSpecs(results[0].id);
                        });
                    }
                    else {
                        connection.query('INSERT INTO certificates values' +
                            ' (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', queryArgs, (error, results) => {
                            this.releaseSafe(connection);
                            if (error) {
                                console.error('failed to run sql query', error);
                                return observer.error(error);
                            }
                            updateSpecs(results.insertId);
                        });
                    }
                });
            });
            return () => null;
        });
    }
    storeContract(contractTimestamp, pdfText) {
        console.log('SyncApi.storeContract()', contractTimestamp);
        return rxjs_1.Observable.create((observer) => {
            this.db.getConnection((error, connection) => {
                if (error) {
                    console.error('failed to get pool connection', error);
                    return observer.error(error);
                }
                connection.query('SELECT id FROM contracts WHERE contract_timestamp = ?', [contractTimestamp], (error, results) => {
                    if (error) {
                        console.error('failed to run sql query', error);
                        return observer.error(error);
                    }
                    const queryArgs = [
                        contractTimestamp,
                        new Date(),
                        c_1.C.DOWNLOAD_CONTRACT_PDF_URI_TEMPLATE +
                            new Date(contractTimestamp).getFullYear() + '/' +
                            contractTimestamp + '.pdf',
                        pdfText.replace(/[\u0800-\uFFFF]/g, '')
                    ];
                    if (results.length > 0) {
                        connection.query('UPDATE contracts SET' +
                            ' contract_timestamp = ?,' +
                            ' sync_date = ?,' +
                            ' download_pdf_uri = ?,' +
                            ' pdf_text = ?' +
                            ' WHERE ID = ?', queryArgs.concat(results[0].id), (error) => {
                            this.releaseSafe(connection);
                            if (error) {
                                console.error('failed to run sql query', error);
                                return observer.error(error);
                            }
                            observer.next(results[0].id);
                            observer.complete();
                        });
                    }
                    else {
                        connection.query('INSERT INTO contracts values' +
                            ' (null, ?, ?, ?, ?)', queryArgs, (error, results) => {
                            this.releaseSafe(connection);
                            if (error) {
                                console.error('failed to run sql query', error);
                                return observer.error(error);
                            }
                            observer.next(results.insertId);
                            observer.complete();
                        });
                    }
                });
            });
            return () => null;
        });
    }
}
exports.SyncApi = SyncApi;
//# sourceMappingURL=sync.api.js.map