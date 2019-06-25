import Turknet from ".."
import moment from "moment";

interface SpeedtestObject {
    lastUpdated: Date;
    periodMonth: number;
    periodYear: number;
    primetimePeriod: string;
    primetimeAverageDown: number;
    primetimeAverageUp: number;
    primetimeAverageLatency: number;
    regularAverageDown: number;
    regularAverageUp: number;
    regularAverageLatency: number;
    totalAverageDown: number;
}

class MonthlySpeedtest {
    // tslint:disable-next-line: variable-name
    private __client: Turknet;
    constructor(client: Turknet) {
        this.__client = client;
    }

    getLastMonthResults(): Promise<SpeedtestObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let raw = await this.__client.__request();
                let data = raw.Result.SpeedtestMonthlyInfoList[0];

                let returnObj: SpeedtestObject = {
                    lastUpdated: moment.tz(data.insert_date, "Europe/Istanbul").toDate(),
                    periodMonth: parseInt(data.month, undefined),
                    periodYear: data.year,
                    primetimePeriod: "19:00 - 22:00",
                    primetimeAverageDown: data.primetime_avgdownload,
                    primetimeAverageUp: data.primetime_avgupload,
                    primetimeAverageLatency: data.primetime_avglatency,
                    regularAverageDown: data.regulartime_avgdownload,
                    regularAverageUp: data.regulartime_avgupload,
                    regularAverageLatency: data.regulartime_avglatency,
                    totalAverageDown: data.total_avgdownload
                };

                return resolve(returnObj);
            } catch (error) {
                return reject(error);
            }
        });
    }

}

export default MonthlySpeedtest;