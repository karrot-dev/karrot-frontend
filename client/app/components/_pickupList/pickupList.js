import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupListComponent from "./pickupList.component";
import pickupListItemComponent from "./pickupListItem/pickupListItem";
import createPickup from "../_createPickup/createPickup";

let pickupListModule = angular.module("pickupList", [
  uiRouter,
  pickupListItemComponent,
  createPickup
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
