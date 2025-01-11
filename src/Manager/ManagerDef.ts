import { EventEmitter } from "events";
import { AllServicesStatus, ServiceStatus } from "./ManagerTypes";

const Manager = new EventEmitter();

const globalStatus: AllServicesStatus = {
    dbconnection: ServiceStatus.STARTING,
}

export { Manager, globalStatus };