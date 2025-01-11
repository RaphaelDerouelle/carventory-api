import { globalStatus, Manager } from "./ManagerDef";
import { Events, ServiceStatus } from "./ManagerTypes";
import logger from "../utils/logger";
import { initDbConnection } from "../services/db";
import { startWebServer } from "../services/webServer"; 


Manager.on(Events.INIT_ALL_SERVICES, () => {
    logger.info('INIT_ALL_SERVICES');
    initDbConnection();
});

Manager.on(Events.DB_CONNECTION_READY, () => {
    globalStatus.dbconnection = ServiceStatus.READY;
    logger.info('DB_CONNECTION_READY');
    Manager.emit(Events.START_WEBSERVER);
});

Manager.on(Events.DB_CONNECTION_NOT_READY, () => {
    globalStatus.dbconnection = ServiceStatus.NOT_READY;
    logger.info('DB_CONNECTION_NOT_READY');
});



Manager.on(Events.START_WEBSERVER, () => {
    let shouldStartWebserver = true;

    if(globalStatus.dbconnection !== ServiceStatus.READY) {
        shouldStartWebserver = false;
    }

    if (shouldStartWebserver) {

        logger.info('START_WEBSERVER');
        startWebServer();
    }
});

Manager.on(Events.STOP_WEBSERVER, () => {
    logger.info('STOP_WEBSERVER');
    // stopWebserver();
});
