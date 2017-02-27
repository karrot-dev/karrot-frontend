import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import storeListComponent from "./storeList.component";
import StoreModule from "../../../services/store/store";
import storeMap from "./_storeMap/storeMap";

let storeListModule = angular.module("storeList", [
  uiRouter,
  ngMaterial,
  StoreModule,
  storeMap
])

.component("storeList", storeListComponent)

.name;

export default storeListModule;
