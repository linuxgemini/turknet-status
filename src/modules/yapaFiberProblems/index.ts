import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export interface YAPAFaultObject {
    outageStatus: string;
    entryDate: Date;
    lastUpdated: Date;
    province: string;
    city: string;
    PoPExchange: string;
}

export class YAPAFiberProblems {
    /** @internal @ignore */
    private __client: Turknet;

    constructor(client: Turknet) {
        this.__client = client;
    }

    private __stripASPDateString(datestr: string): number {
        return parseInt(datestr.replace(/^\/Date\(|\+\d{4}\)\/$/, ""), 10);
    }

    async getAll(): Promise<YAPAFaultObject[]> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let data = raw.YapaFiberFaultInFoList;
            let res = [];

            for (const faultObj of data) {
                let ob: YAPAFaultObject = {
                    outageStatus: faultObj.ArizaDurumu,
                    entryDate: dayjs(this.__stripASPDateString(faultObj.GirisSaati)).utcOffset(3).toDate(),
                    lastUpdated: dayjs(this.__stripASPDateString(faultObj.GuncellenmeTarihi)).utcOffset(3).toDate(),
                    province: faultObj.Il,
                    city: faultObj.Ilce,
                    PoPExchange: faultObj.POP
                };
                res.push(ob);
            }
            
            return res;
        } catch (error) {
            throw error;
        }
    }
}
