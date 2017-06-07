import Store from "./store.service";
import StoreComService from "./store.service";
import CurrentStores from "./currentStores.service";

let storeModule = angular.module("Store", [])

.service("Store", Store)

.service("CurrentStores", CurrentStores)

.service("StoreService", StoreComService)

.name;

export default storeModule;
