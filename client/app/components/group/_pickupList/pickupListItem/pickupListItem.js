import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import pickupListItemComponent from "./pickupListItem.component";

let pickupListItemModule = angular.module("pickupListItem", [
  uiRouter
])

.component("pickupListItem", pickupListItemComponent)

.name;

export default pickupListItemModule;
