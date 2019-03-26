"use strict";
/*
 * @author Oleg Khalidov <brooth@gmail.com>.
 * -----------------------------------------------
 * Freelance software development:
 * Upwork: https://www.upwork.com/fl/khalidovoleg
 * Freelancer: https://www.freelancer.com/u/brooth
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SyncPhase;
(function (SyncPhase) {
    SyncPhase["PARSING_WEBPAGE"] = "PARSING_WEBPAGE";
    SyncPhase["DOWNLOADIN_PDF"] = "DOWNLOADIN_PDF";
    SyncPhase["PARSING_PDF"] = "PARSING_PDF";
    SyncPhase["STORING_DATA"] = "STORING_DATA";
    SyncPhase["COMPLETE"] = "COMPLETE";
    SyncPhase["DOCUMENT_NOT_FOUND"] = "DOCUMENT_NOT_FOUND";
    SyncPhase["CONNECTION_PROBLEMS"] = "CONNECTION_PROBLEMS";
    SyncPhase["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    SyncPhase["ERROR"] = "ERROR";
})(SyncPhase = exports.SyncPhase || (exports.SyncPhase = {}));
class SyncState {
    constructor(contractNumber, phase) {
        this.contractNumber = contractNumber;
        this.phase = phase;
    }
}
exports.SyncState = SyncState;
var UploadPhase;
(function (UploadPhase) {
    UploadPhase["AWAITS"] = "AWAITS";
    UploadPhase["UPLOADIN_PDF"] = "UPLOADIN_PDF";
    UploadPhase["PARSING_PDF"] = "PARSING_PDF";
    UploadPhase["STORING_DATA"] = "STORING_DATA";
    UploadPhase["COMPLETE"] = "COMPLETE";
    UploadPhase["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    UploadPhase["ERROR"] = "ERROR";
})(UploadPhase = exports.UploadPhase || (exports.UploadPhase = {}));
class UploadState {
    constructor(contractTimestamp, phase) {
        this.contractTimestamp = contractTimestamp;
        this.phase = phase;
    }
}
exports.UploadState = UploadState;
//# sourceMappingURL=sync.models.js.map