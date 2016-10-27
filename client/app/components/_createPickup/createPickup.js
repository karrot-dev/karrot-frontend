import angular from "angular";
import uiRouter from "angular-ui-router";
import createPickupComponent from "./createPickup.component";

let createPickupModule = angular.module("createPickup", [
  uiRouter
])

.component("createPickup", createPickupComponent)

.name;

export default createPickupModule;
