import angular from "angular";
import uiRouter from "angular-ui-router";
import storeListComponent from "./storeList.component";
import createStore from "../_createStore/createStore";

let storeListModule = angular.module("storeList", [
  uiRouter,
  createStore
])

.component("storeList", storeListComponent)

.name;

export default storeListModule;
