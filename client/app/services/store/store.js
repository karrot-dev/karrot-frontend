import Store from "./store.service";
import CurrentStores from "./currentStores.service";

let storeModule = angular.module("Store", [])

.service("Store", Store)

.service("CurrentStores", CurrentStores)

.name;

export default storeModule;
