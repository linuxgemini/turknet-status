"use strict";

const moment = require("moment-timezone");

class POPinfo {
    constructor(client) {
        this.client = client;
    }

    __parseDate(dateData) {
        let dateArr = dateData.split(" ");

        let dateProc = dateArr[0].split(".");
        for (const key in dateProc) {
            if (dateProc[key].length === 1) dateProc[key] = `0${dateProc[key]}`;
        }

        let date = dateProc.reverse().join("-");
        let time = dateArr[1];
        return moment.tz(`${date} ${time}`, "Europe/Istanbul").toDate();
    }

    __parsePing(pingStr) {
        if (pingStr === "") return null;
        return parseFloat(pingStr.replace(/,/g, "."));
    }

    getPingData() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.client.__request();
                let data = raw.Result.PingDurationInfoList;
                let res = {};
                for (const popObj of data) {
                    res[popObj.pop_noktasi.toLowerCase()] = {
                        facebook: this.__parsePing(popObj.Facebook_ms),
                        google: this.__parsePing(popObj.Google_ms),
                        netflix: this.__parsePing(popObj.Netflix_ms),
                        spotify: this.__parsePing(popObj.Spotify_ms),
                        twitter: this.__parsePing(popObj.Twitter_ms),
                        youtube: this.__parsePing(popObj.Youtube_ms),
                        localMachine: this.__parsePing(popObj.LokalMachine_ms),
                        lastUpdated: this.__parseDate(popObj.insert_date),
                        lastPinged: this.__parseDate(popObj.ping_date)
                    };
                }
                return resolve(res);
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = POPinfo;