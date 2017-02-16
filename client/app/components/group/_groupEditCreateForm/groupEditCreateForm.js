import angular from "angular";
import uiRouter from "angular-ui-router";
import groupEditCreateFormComponent from "./groupEditCreateForm.component";
import Geocoding from "../../../common/geocoding/geocoding";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let groupEditCreateFormModule = angular.module("groupEditCreateForm", [
  uiRouter,
  Geocoding,
  "ui-leaflet"
])

.component("groupEditCreateForm", groupEditCreateFormComponent)

.name;

export default groupEditCreateFormModule;
