import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import storeListComponent from "./storeList.component";
import StoreModule from "../../common/store/store";
import storeMap from "./_storeMap/storeMap";
import createStore from "../_createStore/createStore";

let storeListModule = angular.module("storeList", [
  uiRouter,
  ngMaterial,
  StoreModule,
  storeMap,
  createStore
])

.component("storeList", storeListComponent)

.name;

export default storeListModule;
