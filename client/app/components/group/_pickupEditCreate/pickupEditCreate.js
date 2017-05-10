import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import PickupDate from "../../../services/pickupDate/pickupDate";
import pickupEditCreateComponent from "./pickupEditCreate.component";

let pickupEditCreateModule = angular.module("pickupEditCreate", [
  uiRouter,
  PickupDate
])

.component("pickupEditCreate", pickupEditCreateComponent)

.name;

export default pickupEditCreateModule;
