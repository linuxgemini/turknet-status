import Turknet from "../index";
import moment from "moment-timezone"

interface FaultObject {
    outageStatus: string;
    lastUpdated: Date;
    province: string;
    city: string;
    PoPExchange: string;
}

class TelekomSSGProblems {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }

    getAll(): Promise<FaultObject[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.TelecomSsgFaultInfoList;
                let res = [];

                for (const faultObj of data) {
                    let ob: FaultObject = {
                        outageStatus: faultObj.ArizaDurumu,
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

export default TelekomSSGProblems;