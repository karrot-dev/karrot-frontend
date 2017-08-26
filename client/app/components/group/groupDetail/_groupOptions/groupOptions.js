import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupOptionsComponent from "./groupOptions.component";
import GroupService from "services/group/group";
import ScreenSizeModule from "services/screenSize/screenSize";

let groupOptionsModule = angular.module("groupOptions", [
  uiRouter,
  ngMaterial,
  GroupService,
  ScreenSizeModule
])

.component("groupOptions", groupOptionsComponent)

.name;

export default groupOptionsModule;
