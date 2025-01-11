export enum ServiceStatus {
    STARTING,
    READY,
    NOT_READY,
}

export interface AllServicesStatus {
    dbconnection: ServiceStatus;
}

export enum Events {
    INIT_ALL_SERVICES = 'INIT_ALL_SERVICES',
    DB_CONNECTION_READY = 'DB_CONNECTION_READY',
    DB_CONNECTION_NOT_READY = 'DB_CONNECTION_NOT_READY',
    START_WEBSERVER = 'START_WEBSERVER',
    STOP_WEBSERVER = 'STOP_WEBSERVER',
}