import angular from "angular";
import uiRouter from "angular-ui-router";
import "angular-simple-logger";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules
import createStoreMapComponent from "./createStoreMap.component";

let createStoreMapModule = angular.module("createStoreMap", [
  uiRouter,
  "nemLogging",
  "ui-leaflet"
])

.component("createStoreMap", createStoreMapComponent)

.name;

export default createStoreMapModule;
