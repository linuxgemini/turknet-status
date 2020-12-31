import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";
import moment from "moment-timezone"

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
    
    async getAll(): Promise<YAPAFaultObject[]> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let data = raw.YapaFiberFaultInFoList;
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
            
            return res;
        } catch (error) {
            throw error;
        }
    }
}
