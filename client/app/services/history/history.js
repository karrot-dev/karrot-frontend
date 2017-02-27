import History from "./history.service";

let historyModule = angular.module("History", [])

.service("History", History)

.name;

export default historyModule;
