"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ToolsApi {
    constructor(connection, wss) {
        this.db = connection;
        this.wss = wss;
        this.status = this.status.bind(this);
        this.createDbSchema = this.createDbSchema.bind(this);
        this.closeWsConnections = this.closeWsConnections.bind(this);
        this.migrateV2 = this.migrateV2.bind(this);
        this.migrateV3 = this.migrateV3.bind(this);
    }
    status(req, res) {
        console.log('ToolsApi.status()');
        res.status(200).send({
            status: 'RUNNING',
            datetime: new Date().toISOString(),
        });
    }
    migrateV2(req, res) {
        console.log('ToolsApi.migrateToV2()');
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            connection.query('RENAME TABLE contracts TO certificates');
            connection.query('CREATE TABLE IF NOT EXISTS contracts (' +
                ' id INT(8) NOT NULL AUTO_INCREMENT,' +
                ' contract_timestamp BIGINT NOT NULL,' +
                ' sync_date DATE NOT NULL,' +
                ' download_pdf_uri VARCHAR(1024) NOT NULL,' +
                ' pdf_text TEXT NOT NULL,' +
                ' PRIMARY KEY (id))' +
                ' CHARACTER SET utf8');
            connection.release();
            res.send({ status: 'OK' });
        });
    }
    migrateV3(req, res) {
        console.log('ToolsApi.migrateToV3()');
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            connection.query('ALTER TABLE certificates' +
                ' ADD COLUMN specs BOOL');
            connection.query('CREATE TABLE IF NOT EXISTS certificate_specs (' +
                ' id INT(8) NOT NULL,' +
                ' product_zh VARCHAR(500) NOT NULL,' +
                ' product_en VARCHAR(500) NOT NULL,' +
                ' purchaser VARCHAR(500) NOT NULL,' +
                ' specifications VARCHAR(1000) NOT NULL,' +
                ' dimension VARCHAR(150) NOT NULL,' +
                ' total_pcs VARCHAR(50) NOT NULL,' +
                ' total_weight VARCHAR(100) NOT NULL,' +
                ' PRIMARY KEY (id))' +
                ' CHARACTER SET utf8');
            connection.release();
            res.send({ status: 'OK' });
        });
    }
    createDbSchema(req, res) {
        console.log('ToolsApi.createDbSchema()');
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'DB connection failed',
                    error: err
                });
            }
            connection.query('CREATE TABLE IF NOT EXISTS certificates (' +
                ' id INT(8) NOT NULL AUTO_INCREMENT,' +
                ' contract_number VARCHAR(50) NOT NULL,' +
                ' certificate_number VARCHAR(50) NOT NULL,' +
                ' collection_method VARCHAR(50) NOT NULL,' +
                ' sync_date DATE NOT NULL,' +
                ' issue_date VARCHAR(30) NOT NULL,' +
                ' delivery_date VARCHAR(30) NOT NULL,' +
                ' webpage_uri VARCHAR(1024) NOT NULL,' +
                ' view_pdf_uri VARCHAR(1024) NOT NULL,' +
                ' download_pdf_uri VARCHAR(1024) NOT NULL,' +
                ' pdf_text TEXT NOT NULL,' +
                ' PRIMARY KEY (id))' +
                ' CHARACTER SET utf8');
            connection.release();
            res.send({ status: 'OK' });
        });
    }
    closeWsConnections(req, res) {
        console.log('closeWsConnections()');
        this.wss.clients.forEach(client => client.close());
        res.send({ status: 'OK' });
    }
}
exports.ToolsApi = ToolsApi;
//# sourceMappingURL=tools.api.js.map