import Turknet from "../index";
import moment from "moment-timezone"

interface TelekomFaultObject {
    outageStatus: string;
    lastUpdated: Date;
    province: string;
    city: string;
    popExchange: string;
}

class TelekomSSGProblems {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }

    getAll(): Promise<TelekomFaultObject[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.TelecomSsgFaultInfoList;
                let res = [];

                for (const faultObj of data) {
                    let ob: TelekomFaultObject = {
                        outageStatus: faultObj.ArizaDurumu,
                        lastUpdated: moment.tz(faultObj.GuncellenmeTarihi, "Europe/Istanbul").toDate(),
                        province: faultObj.Il,
                        city: faultObj.Ilce,
                        popExchange: faultObj.POP
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

export default TelekomSSGProblems;
