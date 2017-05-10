import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupEditCreateFormComponent from "./groupEditCreateForm.component";
import GroupService from "../../../services/group/group";
import Geocoding from "../../../services/geocoding/geocoding";
import markdownInput from "../../_markdownInput/markdownInput";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let groupEditCreateFormModule = angular.module("groupEditCreateForm", [
  uiRouter,
  Geocoding,
  GroupService,
  markdownInput,
  "ui-leaflet"
])

.component("groupEditCreateForm", groupEditCreateFormComponent)

.name;

export default groupEditCreateFormModule;
