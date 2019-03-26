"use strict";
/*
 * @author Oleg Khalidov <brooth@gmail.com>.
 * -----------------------------------------------
 * Freelance software development:
 * Upwork: https://www.upwork.com/fl/khalidovoleg
 * Freelancer: https://www.freelancer.com/u/brooth
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const webSocket = require("ws");
const http = require("http");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const sync_api_1 = require("./api/sync.api");
const c_1 = require("./c");
const tools_api_1 = require("./api/tools.api");
const search_api_1 = require("./api/search.api");
const files_api_1 = require("./api/files.api");
/**
 * MySQL
 */
const dbConfig = 1 || process.env.NODE_ENV == 'production' ? {
    host: '10.66.101.9',
    port: 3306,
    database: 'OLEG-2018-8-2',
    user: 'root',
    password: 'SHGJshgj2015',
    acquireTimeout: 30000,
} : {
    host: 'localhost',
    port: 3306,
    database: 'pdf_fts',
    user: 'brooth',
    password: 'password',
};
const dbPool = mysql.createPool(dbConfig);
const releaseConnectionOrigin = dbPool.releaseConnection.bind(dbPool);
dbPool.releaseConnection = (connection) => {
    if (dbPool._freeConnections.indexOf(connection) === -1) {
        releaseConnectionOrigin(connection);
    }
};
const app = express();
app.use(bodyParser.json({ limit: '99999999mb' }));
app.use(bodyParser.urlencoded({
    limit: '999999999mb',
    extended: true,
    parameterLimit: 9999999999
}));
// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Secret");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
// Super Auth
const freeAccess = [
    '/status',
    '/create_db_schema',
    '/close_ws_connections',
    '/migrate_v',
    '/api/v2/certificates/pdf/',
    '/api/v2/certificates/specs?format=print'
];
app.use((req, res, next) => {
    if (req.method !== 'OPTIONS' &&
        !freeAccess.find(f => req.url.startsWith(f)) &&
        req.header('X-Secret') !== c_1.C.X_SECRET)
        return res.status(403).send();
    next();
});
/**
 * WebSocket
 */
const server = http.createServer(app);
const wss = new webSocket.Server({ server });
/**
 * Routing
 */
const toolsApi = new tools_api_1.ToolsApi(dbPool, wss);
app.get("/status", toolsApi.status);
app.get('/create_db_schema', toolsApi.createDbSchema);
app.get('/close_ws_connections', toolsApi.closeWsConnections);
app.get('/migrate_v2', toolsApi.migrateV2);
app.get('/migrate_v3', toolsApi.migrateV3);
const syncApi = new sync_api_1.SyncApi(dbPool, wss);
app.post('/api/v2/certificates', syncApi.syncCertificates);
app.post('/api/v2/contracts', syncApi.uploadContracts);
const searchApi = new search_api_1.SearchApi(dbPool);
app.get('/api/v2/certificates', searchApi.searchCertificates);
app.get('/api/v2/certificates/specs', searchApi.getCertificateSpecs);
app.get('/api/v2/contracts', searchApi.searchContracts);
const filesApi = new files_api_1.FilesApi(dbPool);
app.get('/api/v2/certificates/pdf/:number', filesApi.downloadCertificatePdf);
/**
 * HTTP Server
 */
console.log('connecting to db ' +
    dbConfig.host + ':' + dbConfig.port);
dbPool.getConnection((error, connection) => {
    if (error) {
        console.log('failed to connect to db.', error);
        return;
    }
    console.log('connected successfully!');
    server.listen(c_1.C.SERVER_POST, function () {
        console.log("app running on port", c_1.C.SERVER_POST);
    });
});
//# sourceMappingURL=app.js.map