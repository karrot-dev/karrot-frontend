import angular from "angular";
import uiRouter from "angular-ui-router";
import PickupDate from "../../../services/pickupDate/pickupDate";
import pickupEditCreateComponent from "./pickupEditCreate.component";
import localTimeInputDirective from "./localTimeInput.directive";

let pickupEditCreateModule = angular.module("pickupEditCreate", [
  uiRouter,
  PickupDate
])

.component("pickupEditCreate", pickupEditCreateComponent)

.directive("localTimeInput", localTimeInputDirective)

.name;

export default pickupEditCreateModule;
