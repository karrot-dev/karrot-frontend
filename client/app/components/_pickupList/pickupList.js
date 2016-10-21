import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupListComponent from "./pickupList.component";
import pickupListItemComponent from "./pickupListItem/pickupListItem";

let pickupListModule = angular.module("pickupList", [
  uiRouter,
  pickupListItemComponent
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
