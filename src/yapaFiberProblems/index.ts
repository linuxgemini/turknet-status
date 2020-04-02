import Turknet from "../index";
import moment from "moment-timezone"

interface YAPAFaultObject {
    outageStatus: string;
    entryDate: Date;
    lastUpdated: Date;
    province: string;
    city: string;
    PoPExchange: string;
}

class YAPAFiberProblems {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }
    
    getAll(): Promise<YAPAFaultObject[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.YapaFiberFaultInFoList;
                let res = [];

                for (const faultObj of data) {
                    let ob: YAPAFaultObject = {
                        outageStatus: faultObj.ArizaDurumu,
                        entryDate: moment.tz(faultObj.GirisSaati, "Europe/Istanbul").toDate(),
                        lastUpdated: moment.tz(faultObj.GuncellenmeTarihi, "Europe/Istanbul").toDate(),
                        province: faultObj.Il,
                        city: faultObj.Ilce,
                        PoPExchange: faultObj.POP
                    };
                    res.push(ob);
                }
                
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default YAPAFiberProblems;
