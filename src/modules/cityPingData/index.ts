import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";

import iller from "./iller.json";

export interface AppPingInfoObject {
    applicationName: string;
    applicationPing: number;
}

export interface CityPingInfo {
    [city: string]: AppPingInfoObject[];
}

export class cityPingData {
    /** @internal @ignore */
    private __client: Turknet;

    constructor(client: Turknet) {
        this.__client = client;
    }

    async getAllResults(): Promise<CityPingInfo> {
        try {
            let rawCategories = await this.__client.__request("pingCategoryReport") as GlobalTypes.PingCategoryObject[];

            let result: CityPingInfo = {};

            for (const categoryObject of rawCategories) {
                let pingData = await this.__client.__requestPingData(categoryObject.Id);
                for (const pingObject of pingData) {
                    if (pingObject.CityCode === 345) continue;
                    let cityName = iller[pingObject.CityCode];
                    if (!result[cityName]) result[cityName] = [];

                    result[cityName].push({
                        applicationName: categoryObject.Description,
                        applicationPing: pingObject.PingValue
                    })
                }
            }

            return result;
        } catch (error: any) {
            return error;
        }
    }

}
