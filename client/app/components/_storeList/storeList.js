import angular from "angular";
import uiRouter from "angular-ui-router";
import storeListComponent from "./storeList.component";

let storeListModule = angular.module("storeList", [
  uiRouter
])

.component("storeList", storeListComponent)

.name;

export default storeListModule;
