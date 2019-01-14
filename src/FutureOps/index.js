"use strict";

const moment = require("moment");

class FutureOps {
    constructor(client) {
        this.client = client;
    }

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

    __convertOutageObject(outageData) {
        try {
            let ret = {};

            let startDate = this.__mergeDateTime(outageData.BaslangicTarihi, outageData.BaslangicSaati);
            let endDate = this.__mergeDateTime(outageData.BitisTarihi, outageData.BitisSaati);
    
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

    getLatestOperation() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.client.__request();
                let data = raw.Result.PlannedOperationInfoList[0];

                let res = this.__convertOutageObject(data);
                if (!res) throw new Error("Got empty data.");

                return resolve(res);
            } catch (error) {
                return reject(error);
            }
        });
    }

    getAllOperations() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.client.__request();
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