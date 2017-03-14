import angular from "angular";
import uiRouter from "angular-ui-router";
import StoreService from "../../../../services/store/store";
import "angular-simple-logger";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules
import storeMapComponent from "./storeMap.component";

let storeMapModule = angular.module("storeMap", [
  uiRouter,
  StoreService,
  "nemLogging",
  "ui-leaflet"
])

.component("storeMap", storeMapComponent)

.name;

export default storeMapModule;
