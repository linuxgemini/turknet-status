import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export interface TelekomFaultObject {
    outageStatus: string;
    lastUpdated: Date;
    province: string;
    city: string;
    popExchange: string;
}

export class TelekomSSGProblems {
    /** @internal @ignore */
    private __client: Turknet;

    constructor(client: Turknet) {
        this.__client = client;
    }

    private __stripASPDateString(datestr: string): number {
        return parseInt(datestr.replace(/^\/Date\(|\+\d{4}\)\/$/, ""), 10);
    }

    async getAll(): Promise<TelekomFaultObject[]> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let data = raw.TelecomSsgFaultInfoList;
            let res = [];

            for (const faultObj of data) {
                let ob: TelekomFaultObject = {
                    outageStatus: faultObj.ArizaDurumu,
                    lastUpdated: dayjs(this.__stripASPDateString(faultObj.GuncellenmeTarihi)).utcOffset(3).toDate(),
                    province: faultObj.Il,
                    city: faultObj.Ilce,
                    popExchange: faultObj.POP
                };
                res.push(ob);
            }
            
            return res;
        } catch (error) {
            throw error;
        }
    }
}
