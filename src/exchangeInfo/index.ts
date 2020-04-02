import Turknet from ".."
import moment from "moment-timezone"

interface InnerPoPObject {
    facebook: number;
    google: number;
    netflix: number | null;
    spotify: number;
    twitter: number;
    youtube: number;
    localMachine: number;
    lastUpdated: Date;
    lastPinged: Date;
}

interface PoPObject {
    trabzon: InnerPoPObject;
    sivas: InnerPoPObject;
    mugla: InnerPoPObject;
    mersin: InnerPoPObject;
    mednautilus: InnerPoPObject;
    manisa: InnerPoPObject;
    konya: InnerPoPObject;
    kayseri: InnerPoPObject;
    gayrettepe: InnerPoPObject;
    eskisehir: InnerPoPObject;
    erzurum: InnerPoPObject;
    diyarbakir: InnerPoPObject;
    denizli: InnerPoPObject;
    balikesir: InnerPoPObject;
    aydin: InnerPoPObject;
    antalya: InnerPoPObject;
    adana: InnerPoPObject;
}

class ExchangeInfo {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }

    private __parseDate(dateData: string) {
        return moment.tz(dateData, "DD.MM.YYYY HH:mm:ss", "Europe/Istanbul").toDate();
    }

    private __parsePing(pingStr: string) {
        if (pingStr === "") return null;
        return parseFloat(pingStr.replace(/,/g, "."));
    }

    getPingData(): Promise<PoPObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.PingDurationInfoList;
                let res: any = {};
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

export default ExchangeInfo;
