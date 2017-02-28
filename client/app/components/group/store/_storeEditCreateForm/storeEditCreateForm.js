import angular from "angular";
import uiRouter from "angular-ui-router";
import storeEditCreateFormComponent from "./storeEditCreateForm.component";
import Geocoding from "../../../../services/geocoding/geocoding";
import StoreService from "../../../../services/store/store";
import markdownInput from "../../../_markdownInput/markdownInput";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let storeEditCreateFormModule = angular.module("storeEditCreateForm", [
  uiRouter,
  Geocoding,
  StoreService,
  markdownInput,
  "ui-leaflet"
])

.component("storeEditCreateForm", storeEditCreateFormComponent)

.name;

export default storeEditCreateFormModule;
