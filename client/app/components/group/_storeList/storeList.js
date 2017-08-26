import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import storeListComponent from "./storeList.component";
import StoreModule from "services/store/store";
import storeMap from "./_storeMap/storeMap";
import ScreenSizeModule from "services/screenSize/screenSize";

let storeListModule = angular.module("storeList", [
  uiRouter,
  ngMaterial,
  StoreModule,
  storeMap,
  ScreenSizeModule
])

.component("storeList", storeListComponent)

.name;

export default storeListModule;
