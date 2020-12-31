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

export interface ResultObject {
    PingDurationInfoList: PingDurationInfoListObject[];
    PlannedOperationInfoList: PlannedOperationInfoListObject[];
    SpeedtestMonthlyInfoList: SpeedtestMonthlyInfoListObject[];
    TelecomSsgFaultInfoList: TelecomSsgFaultInfoListObject[];
    YapaFiberFaultInFoList: YapaFiberFaultInFoListObject[];
}

export interface LatestSpeedtestObject {
    DownloadSpeedAverage: number;
    DownloadSpeedAverageAfterWork: number;
    DownloadSpeedAverageOtherTime: number;
    PingAverage: number;
    PingAverageAfterWork: number;
    PingAverageOtherTime: number;
    UploadAverageOtherTime: number;
    UploadSpeedAverage: number;
    UploadSpeedAverageAfterWork: number;

}

interface LatestCustomerServiceReportsWebGraphObject {
    Description: string;
    Ratio: number;
    RowOfTable: number;
    Title: string;
    Value: string;
}

export interface LatestCustomerServiceReportsObject {
    Icon: string;
    OrderOfTable: number;
    Rows: LatestCustomerServiceReportsWebGraphObject[];
    TableName: string;
}

export interface PingCategoryObject {
    Description: string;
    Id: number;
}

export interface PingCityObject {
    CategoryId: number;
    CityCode: number;
    Id: string;
    PingValue: number;
}