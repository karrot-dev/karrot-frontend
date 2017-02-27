import History from "./history.service";

let historyModule = angular.module("History", [])

.service("HistoryService", History)

.name;

export default historyModule;
