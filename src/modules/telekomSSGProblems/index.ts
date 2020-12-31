import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";
import moment from "moment-timezone";

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

    async getAll(): Promise<TelekomFaultObject[]> {
        try {
            let raw = await this.__client.__request() as GlobalTypes.ResultObject;
            let data = raw.TelecomSsgFaultInfoList;
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
            
            return res;
        } catch (error) {
            throw error;
        }
    }
}
