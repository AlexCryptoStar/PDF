"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @author Oleg Khalidov <brooth@gmail.com>.
 * -----------------------------------------------
 * Freelance software development:
 * Upwork: https://www.upwork.com/fl/khalidovoleg
 * Freelancer: https://www.freelancer.com/u/brooth
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
class FilesApi {
    constructor(connection) {
        this.db = connection;
        this.downloadCertificatePdf = this.downloadCertificatePdf.bind(this);
    }
    downloadCertificatePdf(req, res) {
        console.log('FilesApi.downloadCertificatePdf()', req.params);
        const contractNumber = req.params.number;
        const filesDir = path.join(__dirname, '..', 'files');
        const pdfFileName = contractNumber + '.pdf';
        const pdfFilePath = path.join(filesDir, pdfFileName);
        if (!fs.existsSync(filesDir)) {
            var mode = 0o777 & ~process.umask();
            fs.mkdirSync(filesDir, mode);
        }
        if (fs.existsSync(pdfFilePath)) {
            console.log('%s exists, response from cache', pdfFileName);
            this.responsePdf(pdfFilePath, res, req.query.download);
            return;
        }
        console.log('%s doesnt exist, downloading...', pdfFileName);
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            connection.query('SELECT download_pdf_uri FROM certificates WHERE contract_number = ?', [contractNumber], (error, results) => {
                connection.release();
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        error: error.message,
                    });
                }
                if (results.length === 0)
                    return res.status(404).send();
                const output = fs.createWriteStream(pdfFilePath);
                http.get(results[0].download_pdf_uri, (downloadResp) => {
                    downloadResp.pipe(output);
                    output.on('finish', () => {
                        output.close();
                        console.log('%s downloaded to %s', pdfFileName, pdfFilePath);
                        this.responsePdf(pdfFilePath, res, req.query.download);
                    });
                });
            });
        });
    }
    responsePdf(filePath, res, forceDownload) {
        const stream = fs.createReadStream(filePath);
        var stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        if (forceDownload)
            res.setHeader("Content-Type", "application/force-download");
        else
            res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
    }
}
exports.FilesApi = FilesApi;
//# sourceMappingURL=files.api.js.map