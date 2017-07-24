import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import mapPickerComponent from "./mapPicker.component";
import Group from "services/group/group";
import Geocoding from "services/geocoding/geocoding";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let mapPickerModule = angular.module("mapPicker", [
  uiRouter,
  Group,
  Geocoding,
  "ui-leaflet"
])

.component("mapPicker", mapPickerComponent)

.name;

export default mapPickerModule;