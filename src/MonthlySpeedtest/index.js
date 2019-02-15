"use strict";

const moment = require("moment");

class MonthlySpeedtest {
    constructor(client) {
        this.__client = client;
    }

    /**
     * @typedef {Object} SpeedtestObject
     * @property {Date} lastUpdated
     * @property {Number} periodMonth
     * @property {Number} periodYear
     * @property {String} primetimePeriod
     * @property {Number} primetimeAverageDown
     * @property {Number} primetimeAverageUp
     * @property {Number} primetimeAverageLatency
     * @property {Number} regularAverageDown
     * @property {Number} regularAverageUp
     * @property {Number} regularAverageLatency
     * @property {Number} totalAverageDown
     */

    /**
     * @returns {Promise<SpeedtestObject>}
     */
    getLastMonthResults() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.SpeedtestMonthlyInfoList[0];

                let returnObj = {};

                returnObj.lastUpdated = moment(data.insert_date).toDate();
                returnObj.periodMonth = parseInt(data.month);
                returnObj.periodYear = data.year;

                returnObj.primetimePeriod = "19:00 - 22:00";
                returnObj.primetimeAverageDown = data.primetime_avgdownload;
                returnObj.primetimeAverageUp = data.primetime_avgupload;
                returnObj.primetimeAverageLatency = data.primetime_avglatency;
                
                returnObj.regularAverageDown = data.regulartime_avgdownload;
                returnObj.regularAverageUp = data.regulartime_avgupload;
                returnObj.regularAverageLatency = data.regulartime_avglatency;

                returnObj.totalAverageDown = data.total_avgdownload;

                return resolve(returnObj);
            } catch (error) {
                return reject(error);
            }
        });
    }

}

module.exports = MonthlySpeedtest;