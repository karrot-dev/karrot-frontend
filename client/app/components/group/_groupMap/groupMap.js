import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import StoreService from "services/store/store";
import groupModule from "services/group/group";
import "angular-simple-logger";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules
import groupMapComponent from "./groupMap.component";

let groupMapModule = angular.module("groupMap", [
  uiRouter,
  StoreService,
  groupModule,
  "nemLogging",
  "ui-leaflet"
])

.component("groupMap", groupMapComponent)

.name;

export default groupMapModule;
