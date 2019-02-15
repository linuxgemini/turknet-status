"use strict";

const moment = require("moment-timezone");

class POPinfo {
    constructor(client) {
        this.__client = client;
    }

    /**
     * @typedef {Object} PoPObject 
     * @property {InnerPoPObject} trabzon
     * @property {InnerPoPObject} sivas
     * @property {InnerPoPObject} mugla
     * @property {InnerPoPObject} mersin
     * @property {InnerPoPObject} mednautilus
     * @property {InnerPoPObject} manisa
     * @property {InnerPoPObject} konya
     * @property {InnerPoPObject} kayseri
     * @property {InnerPoPObject} gayrettepe
     * @property {InnerPoPObject} eskisehir
     * @property {InnerPoPObject} erzurum
     * @property {InnerPoPObject} diyarbakir
     * @property {InnerPoPObject} denizli
     * @property {InnerPoPObject} balikesir
     * @property {InnerPoPObject} aydin
     * @property {InnerPoPObject} antalya
     * @property {InnerPoPObject} adana
     */

    /**
     * @typedef {Object} InnerPoPObject 
     * @property {Number} facebook 
     * @property {Number} google
     * @property {Number|null} netflix
     * @property {Number} spotify
     * @property {Number} twitter
     * @property {Number} youtube
     * @property {Number} localMachine
     * @property {Date} lastUpdated
     * @property {Date} lastPinged
     */

    /**
     * Converts date string to date.
     * @param {String} dateData 
     * @returns {Date}
     */
    __parseDate(dateData) {
        return moment.tz(dateData, "DD.MM.YYYY HH:mm:ss", "Europe/Istanbul").toDate();
    }

    /**
     * Converts ping string to number.
     * @param {String} pingStr 
     * @returns {Number}
     */
    __parsePing(pingStr) {
        if (pingStr === "") return null;
        return parseFloat(pingStr.replace(/,/g, "."));
    }

    /**
     * Gets the ping values from PoP exchanges.
     * @returns {Promise<PoPObject>}
     */
    getPingData() {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
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