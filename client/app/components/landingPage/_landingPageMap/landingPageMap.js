import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import landingPageMapComponent from "./landingPageMap.component";
import groupPopup from "./_groupPopup/groupPopup";
import GroupService from "services/group/group";
import "leaflet";
import "ui-leaflet";

let landingPageMapModule = angular.module("landingPageMap", [
  uiRouter,
  groupPopup,
  GroupService,
  "ui-leaflet"
])

.component("landingPageMap", landingPageMapComponent)

.name;

export default landingPageMapModule;
