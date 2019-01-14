"use strict";

class turknetError extends Error {
    constructor(errcode = "0000", errmessage = "Unknown error, contact package writer @linuxgemini", ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, turknetError);
        }

        // Custom debugging information
        this.name = "turknetError";
        this.code = errcode;
        this.message = errmessage;
        this.date = new Date();
    }
}

module.exports = turknetError;