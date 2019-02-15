/*--------------------------------------------------------------
 *  Türk.net Status Endpoint Wrapper
 *  Author: linuxgemini
 *  Released under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

/*
 * Initalise parsers for each type
 */
const MonthlySpeedtest = require("./MonthlySpeedtest/index");
const FutureOps = require("./FutureOps/index");
const POPinfo = require("./POPinfo/index");
const TelekomSSGProblems = require("./TelekomSSGProblems/index");
const YAPAFiberProblems = require("./YAPAFiberProblems/index");

/*
 * Local error handler
 */
const errorHandler = require("./errorHandler/index");

/*
 * Initalise the request-promise-native package
 */
const request = require("request-promise-native");

class Turknet {
    constructor() {
        this.__endpoint = "https://turk.net/service/InformationServ.svc/GetNetworkOperationInfo"; // Endpoint is used in https://turk.net/turknet-karnesi

        this.errorHandler = errorHandler; // errorHandler extends the Error class so we shouldn't ever call a new one.

        // We call each parser with this main class
        this.monthlySpeedtest = new MonthlySpeedtest(this);
        this.futureOps = new FutureOps(this);
        this.exchangeInfo = new POPinfo(this);
        this.telekomSSGProblems = new TelekomSSGProblems(this);
        this.yapaFiberProblems = new YAPAFiberProblems(this);
    }

    get __generateConfig() {
        return {
            method: "PUT",
            url: this.__endpoint,
            headers: {
                "cache-control": "no-cache"
            },
            json: true
        };
    }

    __request() {
        return new Promise(async (resolve, reject) => {
            try {
                let req = await request(this.__generateConfig);
                if (req.ServiceResult.Code !== 0) throw new this.errorHandler(req.ServiceResult.Code, req.ServiceResult.Message);
                return resolve(req);
            } catch (error) {
                if (error.code === "0000") return reject(error);
                return reject(new Error(`Server responded with an error:\n\n${error.stack}`));
            }
        });
    }
}

module.exports = Turknet;