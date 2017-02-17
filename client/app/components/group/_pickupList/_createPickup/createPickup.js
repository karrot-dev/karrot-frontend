import angular from "angular";
import uiRouter from "angular-ui-router";
import PickupDate from "../../common/pickupDate/pickupDate";
import createPickupComponent from "./createPickup.component";

let createPickupModule = angular.module("createPickup", [
  uiRouter,
  PickupDate
])

.component("createPickup", createPickupComponent)

.name;

export default createPickupModule;
