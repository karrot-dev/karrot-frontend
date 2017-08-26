import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import pickupManageActionComponent from "./pickupManageAction.component";
import ScreenSizeModule from "services/screenSize/screenSize";

let pickupManageActionModule = angular.module("pickupManageAction", [
  uiRouter,
  ngMaterial,
  ScreenSizeModule
])

.component("pickupManageAction", pickupManageActionComponent)

.name;

export default pickupManageActionModule;
