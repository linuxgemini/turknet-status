import {Turknet} from "../../Turknet";
import * as GlobalTypes from "../../dataTypes";

export interface nperfSpeedtestObject {
    averageDownloadKbps: number;
    averageDownloadPrimetimeKbps: number;
    averageDownloadGraveyardSlotKbps: number;
    averageUploadKbps: number;
    averageUploadPrimetimeKbps: number;
    averageUploadGraveyardSlotKbps: number;
    averagePingMs: number;
    averagePingPrimetimeMs: number;
    averagePingGraveyardSlotMs: number;
}

export class nperfSpeedtest {
    /** @internal @ignore */
    private __client: Turknet;

    constructor(client: Turknet) {
        this.__client = client;
    }

    async getResults(): Promise<nperfSpeedtestObject> {
        try {
            let data = await this.__client.__request("latestSpeedtest") as GlobalTypes.LatestSpeedtestObject;

            let returnObj: nperfSpeedtestObject = {
                averageDownloadKbps: data.DownloadSpeedAverage,
                averageDownloadPrimetimeKbps: data.DownloadSpeedAverageAfterWork,
                averageDownloadGraveyardSlotKbps: data.DownloadSpeedAverageOtherTime,
                averageUploadKbps: data.UploadSpeedAverage,
                averageUploadPrimetimeKbps: data.UploadSpeedAverageAfterWork,
                averageUploadGraveyardSlotKbps: data.UploadAverageOtherTime,
                averagePingMs: data.PingAverage,
                averagePingPrimetimeMs: data.PingAverageAfterWork,
                averagePingGraveyardSlotMs: data.PingAverageOtherTime
            };

            return returnObj;
        } catch (error: any) {
            return error;
        }
    }

}
