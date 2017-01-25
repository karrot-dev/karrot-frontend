import angular from "angular";
import uiRouter from "angular-ui-router";
import "angular-simple-logger";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules
import storeDetailMapComponent from "./storeDetailMap.component";

let storeDetailMapModule = angular.module("storeDetailMap", [
  uiRouter,
  "nemLogging",
  "ui-leaflet"
])

.component("storeDetailMap", storeDetailMapComponent)

.name;

export default storeDetailMapModule;
