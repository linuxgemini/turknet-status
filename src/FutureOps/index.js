"use strict";

const moment = require("moment");

class FutureOps {
    constructor(client) {
        this.__client = client;
    }

    /**
     * @typedef {Object} rawOutageObject
     * @property {String} Aciklama
     * @property {String} BaslangicSaati
     * @property {String} BaslangicTarihi
     * @property {String} BitisSaati
     * @property {String} BitisTarihi
     * @property {String} Calisma
     * @property {String} CalismaKategorisi
     * @property {String} HOSTNAME
     * @property {String} Il
     * @property {String} Ilce
     * @property {String} KesintiSuresi
     * @property {String} POP
     * @property {String} SSG
     */

    /**
     * @typedef {Object} OutageObject
     * @property {String} description
     * @property {Date} startDate
     * @property {Date} endDate
     * @property {WorkObject} work
     */

    /**
     * @typedef {Object} WorkObject
     * @property {String} type
     * @property {String} outageTime
     * @property {String} popExchange
     * @property {String} affectedSSG
     * @property {String} affectedHost
     * @property {String} province
     * @property {String} city
     * @property {String} rawData
     */

    /**
     * Merge ASP.NET date and classic HH:MM:SS time together.
     * @param {String} date Any Date Object.
     * @param {String} time HH:MM:SS
     * @returns {Date} JS Date
     */
    __mergeDateTime(date, time) {
        if (!date || !time) throw new Error("Missing input.");
        if (!time.includes(":")) throw new Error("Invalid time object.");
        let parsedDate = moment(date);
        let splitTime = time.split(":");
        if (splitTime.length !== 3) throw new Error("Missing time object.");
        return parsedDate.hour(parseInt(splitTime[0])).minute(parseInt(splitTime[1])).second(parseInt(splitTime[2])).toDate();
    }

    /**
     * Converts outage object to a readable one.
     * @param {rawOutageObject} outageData 
     * @returns {OutageObject}
     */
    __convertOutageObject(outageData) {
        try {
            /**
             * @type {OutageObject}
             */
            let ret = {};

            let startDate = this.__mergeDateTime(outageData.BaslangicTarihi, outageData.BaslangicSaati);
            let endDate = this.__mergeDateTime(outageData.BitisTarihi, outageData.BitisSaati);
            
            // we don't like CRLF here
            ret.description = outageData.Aciklama.replace(/\r\n/g, "\n");
            ret.startDate = startDate;
            ret.endDate = endDate;
            ret.work = {
                type: outageData.CalismaKategorisi,
                outageTime: outageData.KesintiSuresi,
                popExchange: outageData.POP,
                affectedSSG: outageData.SSG,
                affectedHost: outageData.HOSTNAME,
                province: outageData.Il,
                city: outageData.Ilce,
                rawData: outageData.Calisma
            };
    
            return ret;
        } catch (error) {
            return null;
        }
    }

    /**
     * @returns {OutageObject}
     */
    getLatestOperation() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.PlannedOperationInfoList[0];

                let res = this.__convertOutageObject(data);
                if (!res) throw new Error("Got empty data.");

                return resolve(res);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * @returns {Promise<{OutageObject}>}
     */
    getAllOperations() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let datas = raw.Result.PlannedOperationInfoList;

                let resp = [];

                for (const outageObj of datas) {
                    resp.push(this.__convertOutageObject(outageObj));
                }

                return resolve(resp);
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = FutureOps;