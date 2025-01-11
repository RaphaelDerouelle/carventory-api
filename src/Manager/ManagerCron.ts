import { Manager } from "./ManagerDef";
import { Events } from "./ManagerTypes";
import { CONVERT_TO_MS, MINUTE, SECOND } from '../utils/timing'
import logger from "../utils/logger";

setInterval((): void => {
    logger.info('... SERVER IS RUNNING ...');
}, CONVERT_TO_MS(5 * MINUTE));
