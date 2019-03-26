"use strict";
/*
 * @author Oleg Khalidov <brooth@gmail.com>.
 * -----------------------------------------------
 * Freelance software development:
 * Upwork: https://www.upwork.com/fl/khalidovoleg
 * Freelancer: https://www.freelancer.com/u/brooth
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SearchApi {
    constructor(connection) {
        this.db = connection;
        this.searchCertificates = this.searchCertificates.bind(this);
        this.getCertificateSpecs = this.getCertificateSpecs.bind(this);
        this.searchContracts = this.searchContracts.bind(this);
    }
    certificateSpecsToHtmlPrint(specs) {
        const html = new Array();
        html.push('<html><body>');
        html.push('<table border="1" bordercolor="#ccc" cellpadding="5"');
        html.push(' style="width: 100%; border-collapse: collapse; font-size: 13;">');
        html.push('<thead><tr>');
        html.push('<th>订货合同号</th>');
        html.push('<th>产品名称</th>');
        html.push('<th>标 准</th>');
        html.push('<th>收 货 单 位</th>');
        html.push('<th>规格</th>');
        html.push('<th>总根数</th>');
        html.push('<th>总重量</th>');
        html.push('</tr></thead>');
        specs.forEach(item => {
            html.push('<tr>');
            html.push('<td>' + item.contract_number + '</td>');
            html.push('<td>' + item.product_zh + '<br/>' + item.product_en + '</td>');
            html.push('<td>' + item.specifications.replace(/\n/g, '<br/>') + '</td>');
            html.push('<td>' + item.purchaser + '</td>');
            html.push('<td>' + item.dimension + '</td>');
            html.push('<td>' + item.total_pcs + '</td>');
            html.push('<td>' + item.total_weight + '</td>');
            html.push('</tr>');
        });
        html.push('</tbody></table>');
        html.push('<script>print();</script>');
        html.push('</body></html>');
        return html.join('\n');
    }
    getCertificateSpecs(req, res) {
        console.log('SearchApi.getCertificateSpecs()', req.query);
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            const ids = req.query['ids'].split(',');
            connection.query('SELECT cs.*, c.contract_number' +
                ' FROM certificate_specs cs' +
                ' INNER JOIN certificates c ON c.id = cs.id' +
                ' WHERE cs.id IN (?)', [ids], (error, results) => {
                connection.release();
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        error: error.message,
                    });
                }
                if (req.query['format'] === 'print') {
                    res.send(this.certificateSpecsToHtmlPrint(results));
                }
                else {
                    res.status(200).send({
                        status: 'OK',
                        data: results,
                    });
                }
            });
        });
    }
    searchCertificates(req, res) {
        console.log('SearchApi.searchCertificates()', req.query);
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            const filters = req.query.search
                ? req.query.search.split('&&')
                    .map((filter) => `%${filter.trim()}%`)
                : undefined;
            const where = filters
                ? filters.map((_, index) => (index == 0 ? ' WHERE' : ' AND') + ' pdf_text LIKE ?')
                    .join(' ')
                : '';
            console.log('query where:', where, filters);
            connection.query('SELECT id, ' +
                ' contract_number,' +
                ' certificate_number,' +
                ' collection_method,' +
                ' sync_date,' +
                ' issue_date,' +
                ' delivery_date,' +
                ' webpage_uri,' +
                ' view_pdf_uri,' +
                ' download_pdf_uri,' +
                ' specs' +
                ' FROM certificates' +
                where +
                ' ORDER BY contract_number', filters, (error, results) => {
                connection.release();
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        error: error.message,
                    });
                }
                res.status(200).send({
                    status: 'OK',
                    data: results.map((item) => (Object.assign({}, item, { specs: item.specs == 1 ? true : item.specs == 0 ? false : null }))),
                });
            });
        });
    }
    searchContracts(req, res) {
        console.log('SearchApi.searchContracts()', req.query);
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            const filters = req.query.search
                ? req.query.search.split('&&')
                    .map((filter) => `%${filter.trim()}%`)
                : undefined;
            const where = filters
                ? filters.map((_, index) => (index == 0 ? ' WHERE' : ' AND') + ' pdf_text LIKE ?')
                    .join(' ')
                : '';
            console.log('query where:', where, filters);
            connection.query('SELECT id, ' +
                ' contract_timestamp,' +
                ' sync_date,' +
                ' download_pdf_uri' +
                ' FROM contracts' +
                where +
                ' ORDER BY contract_timestamp', filters, (error, results) => {
                connection.release();
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        error: error.message,
                    });
                }
                res.status(200).send({
                    status: 'OK',
                    data: results,
                });
            });
        });
    }
}
exports.SearchApi = SearchApi;
//# sourceMappingURL=search.api.js.map