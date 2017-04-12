import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import pickupManageActionComponent from "./pickupManageAction.component";

let pickupManageActionModule = angular.module("pickupManageAction", [
  uiRouter,
  ngMaterial
])

.component("pickupManageAction", pickupManageActionComponent)

.name;

export default pickupManageActionModule;
