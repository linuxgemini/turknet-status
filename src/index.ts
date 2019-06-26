/*--------------------------------------------------------------
 *  Türk.net Status Endpoint Wrapper
 *  Author: linuxgemini
 *  Released under the MIT License.
 *-------------------------------------------------------------*/

/*
 * Initalise parsers for each type
 */
import MonthlySpeedtest from "./MonthlySpeedtest/index";
import FutureOps from "./FutureOps/index";
import POPinfo from "./POPinfo/index";
import TelekomSSGProblems from "./TelekomSSGProblems/index";
import YAPAFiberProblems from "./YAPAFiberProblems/index";

/*
 * Local error handler
 */
import errorHandler from "./errorHandler/index";

/*
 * Initalise the request-promise-native package
 */
import request from "request-promise-native";

interface ServiceResultObject {
    Code: number;
    Description: string;
    Message: string;
    ResultType: number;
}

interface PingDurationInfoListObject {
    Facebook_ms: string;
    Google_ms: string;
    LokalMachine_ms: string;
    Netflix_ms: string;
    Spotify_ms: string;
    Twitter_ms: string;
    Youtube_ms: string;
    insert_date: string;
    ping_date: string;
    pop_noktasi: string;
}

interface PlannedOperationInfoListObject {
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

interface SpeedtestMonthlyInfoListObject {
    insert_date: string;
    month: string;
    primetime_avgdownload: number;
    primetime_avglatency: number;
    primetime_avgupload: number;
    regulartime_avgdownload: number;
    regulartime_avglatency: number;
    regulartime_avgupload: number;
    total_avgdownload: number;
    year: number;
}

interface TelecomSsgFaultInfoListObject {
    ArizaDurumu: string;
    GuncellenmeTarihi: string;
    Il: string;
    Ilce: string;
    POP: string;
}

interface YapaFiberFaultInFoListObject {
    ArizaDurumu: string;
    GirisSaati: string;
    GuncellenmeTarihi: string;
    Il: string;
    Ilce: string;
    POP: string;
}

interface ResultObject {
    PingDurationInfoList: PingDurationInfoListObject[];
    PlannedOperationInfoList: PlannedOperationInfoListObject[];
    SpeedtestMonthlyInfoList: SpeedtestMonthlyInfoListObject[];
    TelecomSsgFaultInfoList: TelecomSsgFaultInfoListObject[];
    YapaFiberFaultInFoList: YapaFiberFaultInFoListObject[];
}

interface RawDataObject {
    ServiceResult: ServiceResultObject;
    Result: ResultObject;
}

class Turknet {
    private __endpoint: string;
    public errorHandler: typeof errorHandler;

    public monthlySpeedtest: MonthlySpeedtest;
    public futureOps: FutureOps;
    public exchangeInfo: POPinfo;
    public telekomSSGProblems: TelekomSSGProblems;
    public yapaFiberProblems: YAPAFiberProblems;
    constructor() {
        this.__endpoint = "https://turk.net/service/InformationServ.svc/GetNetworkOperationInfo"; // Endpoint is used in https://turk.net/turknet-karnesi

        this.errorHandler = errorHandler; // errorHandler extends the Error class so we shouldn't ever call a new one.

        // We call each parser with this main class
        this.monthlySpeedtest = new MonthlySpeedtest(this);
        this.futureOps = new FutureOps(this);
        this.exchangeInfo = new POPinfo(this);
        this.telekomSSGProblems = new TelekomSSGProblems(this);
        this.yapaFiberProblems = new YAPAFiberProblems(this);
    }

    private get __generateConfig() {
        return {
            method: "PUT",
            url: this.__endpoint,
            headers: {
                "cache-control": "no-cache"
            },
            json: true
        };
    }

    __request(): Promise<RawDataObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let req: RawDataObject = await request(this.__generateConfig); // tslint:disable-line
                if (req.ServiceResult.Code !== 0) throw new this.errorHandler(req.ServiceResult.Code.toString(), req.ServiceResult.Message);
                return resolve(req);
            } catch (error) {
                if (error.code === "0000") return reject(error);
                return reject(new Error(`Server responded with an error:\n\n${error.stack}`));
            }
        });
    }
}

export default Turknet;

export const StatusClient = Turknet;
