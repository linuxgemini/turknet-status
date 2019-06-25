import Turknet from ".."
import moment from "moment-timezone";

interface RawOutageObject {
    Aciklama: string;
    BaslangicSaati: string;
    BaslangicTarihi: string;
    BitisSaati: string;
    BitisTarihi: string;
    Calisma: string;
    CalismaKategorisi: string;
    HOSTNAME: string;
    Il: string;
    Ilce: string;
    KesintiSuresi: string;
    POP: string;
    SSG: string;
}

interface WorkObject {
    type: string;
    outageTime: string;
    popExchange: string;
    affectedSSG: string;
    affectedHost: string;
    province: string;
    city: string;
    rawData: string;
}

interface OutageObject {
    description: string;
    startDate: Date;
    endDate: Date;
    work: WorkObject;
}

class FutureOps {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }


    private __mergeDateTime(date: string, time: string) {
        if (!time.includes(":")) throw new Error("Invalid time object.");
        let parsedDate = moment.tz(date, "Europe/Istanbul");
        let splitTime = time.split(":");
        if (splitTime.length !== 3) throw new Error("Missing time object.");
        return parsedDate.hour(parseInt(splitTime[0], undefined)).minute(parseInt(splitTime[1], undefined)).second(parseInt(splitTime[2], undefined)).toDate();
    }

    private __convertOutageObject(outageData: RawOutageObject) {
        try {
            
            let startDate = this.__mergeDateTime(outageData.BaslangicTarihi, outageData.BaslangicSaati);
            let endDate = this.__mergeDateTime(outageData.BitisTarihi, outageData.BitisSaati);

            let ret: OutageObject = {
                description: outageData.Aciklama.replace(/\r\n/g, "\n"), // we don't like CRLF here
                startDate: startDate,
                endDate: endDate,
                work: {
                    type: outageData.CalismaKategorisi,
                    outageTime: outageData.KesintiSuresi,
                    popExchange: outageData.POP,
                    affectedSSG: outageData.SSG,
                    affectedHost: outageData.HOSTNAME,
                    province: outageData.Il,
                    city: outageData.Ilce,
                    rawData: outageData.Calisma
                }
            };
            
            return ret;
        } catch (error) {
            return null;
        }
    }

    getLatestOperation(): Promise<OutageObject> {
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


    getAllOperations(): Promise<OutageObject[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let datas = raw.Result.PlannedOperationInfoList;

                let resp = [];

                for (const outageObj of datas) {
                    let d = this.__convertOutageObject(outageObj)
                    if (d === null) continue;
                    resp.push(d);
                }

                return resolve(resp);
            } catch (error) {
                return reject(error);
            }
        });
    }
}

export default FutureOps;
