import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

export interface WorkObject {
    type: string;
    outageTime: string;
    popExchange: string;
    affectedSSG: string;
    affectedHost: string;
    province: string;
    city: string;
    rawData: string;
}

export interface OutageObject {
    description: string;
    startDate: Date;
    endDate: Date;
    work: WorkObject;
}

export class FutureOps {
    /** @internal @ignore */
    private __client: Turknet;

    constructor(client: Turknet) {
        this.__client = client;
    }

    private __stripASPDateString(datestr: string): number {
        return parseInt(datestr.replace(/^\/Date\(|\+\d{4}\)\/$/, ""), 10);
    }

    private __mergeDateTime(date: string, time: string) {
        if (!time.includes(":")) throw new Error("Invalid time object.");
        let parsedDate = dayjs(this.__stripASPDateString(date)).utcOffset(3);
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

    async getLatestOperation(): Promise<OutageObject> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let data = raw.PlannedOperationInfoList[0];

            let res = this.__convertOutageObject(data);
            if (!res) throw new Error("Got empty data.");

            return res;
        } catch (error: any) {
            return error;
        }
    }


    async getAllOperations(): Promise<OutageObject[]> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let datas = raw.PlannedOperationInfoList;

            let resp = [];

            for (const outageObj of datas) {
                let d = this.__convertOutageObject(outageObj)
                if (d === null) continue;
                resp.push(d);
            }

            return resp;
        } catch (error: any) {
            return error;
        }
    }
}
