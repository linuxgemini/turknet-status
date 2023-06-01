/*--------------------------------------------------------------
 *  Türk.net Status Endpoint Wrapper
 *  Author: linuxgemini
 *  Released under the MIT License.
 *-------------------------------------------------------------*/

/**
  * @packageDocumentation
  * @module Turknet
  */

/*
 * Initalise parsers for each type
 */
import {FutureOps} from "./modules/futureOps/index";
import {TelekomSSGProblems} from "./modules/telekomSSGProblems/index";
import {YAPAFiberProblems} from "./modules/yapaFiberProblems/index";
import {nperfSpeedtest} from "./modules/nperfSpeedtest/index";
import {cityPingData} from "./modules/cityPingData/index";

/*
 * Local error handler
 */
import {turknetError} from "./modules/errorHandler/index";

/*
 * Initalise the node-fetch package
 */
import * as nodeFetch from "node-fetch";

/*
 *  Import types
 */
import * as GlobalTypes from "./dataTypes";


interface EndpointObject {
    main: string;
    latestSpeedtest: string;
    customerServiceReports: string;
    pingCategoryReport: string;
    pingCityReport: string;
    /** @deprecated */
    abstractInfoJSON: string;
}

interface ServiceResultObject {
    Code: number;
    Description: string;
    Message: string;
    ResultType: number;
}

interface RawDataObject {
    ServiceResult: ServiceResultObject;
    Result: GlobalTypes.ResultObject | GlobalTypes.LatestSpeedtestObject | GlobalTypes.LatestCustomerServiceReportsObject[] | GlobalTypes.PingCategoryObject[] | GlobalTypes.PingCityObject[];
}

interface RequestHeadersObject {
    "cache-control": "no-cache";
    "content-type"?: "application/json";
}

interface RequestOptionsObject {
    method: "PUT" | "GET";
    headers: RequestHeadersObject;
    body?: any;
    timeout: number;
}

// `AbortSignal` is defined here to prevent a dependency on a particular
// implementation like the `abort-controller` package, and to avoid requiring
// the `dom` library in `tsconfig.json`.
interface AbortSignal {
    aborted: boolean;
    reason: any;

    addEventListener: (type: "abort", listener: ((this: AbortSignal, event: any) => any), options?: boolean | {
        capture?: boolean | undefined,
        once?: boolean | undefined,
        passive?: boolean | undefined
    }) => void;

    removeEventListener: (type: "abort", listener: ((this: AbortSignal, event: any) => any), options?: boolean | {
        capture?: boolean | undefined
    }) => void;

    dispatchEvent: (event: any) => boolean;

    onabort: null | ((this: AbortSignal, event: any) => any);

    throwIfAborted(): void;
}

export class Turknet {
    private __endpoint: string;
    private __endpoints: EndpointObject;
    public errorHandler: typeof turknetError;

    public futureOps: FutureOps;
    public telekomSSGProblems: TelekomSSGProblems;
    public yapaFiberProblems: YAPAFiberProblems;
    public nperfSpeedtest: nperfSpeedtest;
    public cityPingData: cityPingData;

    /**
     * This is technically `new Turknet();`
     */
    constructor() {
        this.__endpoint = "https://turk.net/service/InformationServ.svc/GetNetworkOperationInfo"; // Endpoint is used in https://turk.net/turknet-karnesi
        this.__endpoints = {
            main: this.__endpoint,
            latestSpeedtest: "https://turk.net/service/InformationServ.svc/GetSpeedTestSummary",
            customerServiceReports: "https://turk.net/service/InformationServ.svc/GetTurknetReport",
            pingCategoryReport: "https://turk.net/service/InformationServ.svc/GetTurknetPingCategory",
            pingCityReport: "https://turk.net/service/InformationServ.svc/GetTurknetPingReport",
            abstractInfoJSON: "https://turk.net/data/karne.json"
        };

        this.errorHandler = turknetError; // errorHandler extends the Error class so we shouldn't ever call a new one.

        // We call each parser with this main class
        this.futureOps = new FutureOps(this);
        this.telekomSSGProblems = new TelekomSSGProblems(this);
        this.yapaFiberProblems = new YAPAFiberProblems(this);
        this.nperfSpeedtest = new nperfSpeedtest(this);
        this.cityPingData = new cityPingData(this);
    }

    /** @internal */
    private __sleep(ms = 0, signal: AbortSignal) {
        return new Promise<void>((resolve, reject) => {
          const id = setTimeout(() => resolve(), ms);
          signal?.addEventListener("abort", () => {
            clearTimeout(id);
            reject();
          });
        });
    }

    private async __fetch(
        resource: nodeFetch.RequestInfo,
        options: nodeFetch.RequestInit
      ) {
        const { timeout, signal, ...ropts } = options ?? {};
      
        const controller = new AbortController();
        let sleepController;
        try {
          signal?.addEventListener("abort", () => controller.abort());
      
          const request = nodeFetch.default(resource, {
            ...ropts,
            signal: controller.signal,
          });
      
          if (timeout != null) {
            sleepController = new AbortController();
            const aborter = this.__sleep(timeout, sleepController.signal);
            const race = await Promise.race([aborter, request]);
            if (race == null) controller.abort();
          }
      
          return request;
        } finally {
          sleepController?.abort();
        }
      }

    /** @internal */
    private __generateConfig(serverType: "main"|"latestSpeedtest"|"customerServiceReports"|"pingCategoryReport"|"pingCityReport" = "main", body?: any): any {
        let returning: RequestOptionsObject = {
            method: "PUT",
            headers: {
                "cache-control": "no-cache",
            },
            timeout: 3000,
        };

        if (serverType === "latestSpeedtest" || serverType === "customerServiceReports" || serverType === "pingCategoryReport") returning.method = "GET";
        if (serverType === "pingCityReport") {
            returning.headers["content-type"] = "application/json";
            returning.body = JSON.stringify({CategoryId: body});
        }
        return returning;
    }

    /** @internal */
    async __request(server: "main"|"latestSpeedtest"|"customerServiceReports"|"pingCategoryReport" = "main"): Promise<GlobalTypes.ResultObject | GlobalTypes.LatestSpeedtestObject | GlobalTypes.LatestCustomerServiceReportsObject[] | GlobalTypes.PingCategoryObject[]> {
        try {
            let fetchreq = await this.__fetch(this.__endpoints[server], this.__generateConfig(server));
            let req: RawDataObject = await fetchreq.json();
            if (req.ServiceResult.Code !== 0) throw new this.errorHandler(req.ServiceResult.Code.toString(), req.ServiceResult.Message);
            let res = req.Result as GlobalTypes.ResultObject | GlobalTypes.LatestSpeedtestObject | GlobalTypes.LatestCustomerServiceReportsObject[] | GlobalTypes.PingCategoryObject[];
            return res;
        } catch (error: any) {
            if (error?.code === "0000") throw error;
            throw new Error(`Server responded with an error:\n\n${error?.stack}`);
        }
    }

    /** @internal */
    async __requestPingData(categoryId: number): Promise<GlobalTypes.PingCityObject[]> {
        try {
            let fetchreq = await this.__fetch(this.__endpoints.pingCityReport, this.__generateConfig("pingCityReport", categoryId));
            let req: RawDataObject = await fetchreq.json();
            if (req.ServiceResult.Code !== 0) throw new this.errorHandler(req.ServiceResult.Code.toString(), req.ServiceResult.Message);
            let res = req.Result as GlobalTypes.PingCityObject[];
            return res;
        } catch (error: any) {
            if (error?.code === "0000") throw error;
            throw new Error(`Server responded with an error:\n\n${error?.stack}`);
        }
    }
}
