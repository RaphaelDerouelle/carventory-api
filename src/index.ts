import { Events } from "./Manager/ManagerTypes";
import { Manager } from "./Manager/ManagerDef";
import "./Manager/ManagerCron";
import "./Manager/Manager";

Manager.emit(Events.INIT_ALL_SERVICES);