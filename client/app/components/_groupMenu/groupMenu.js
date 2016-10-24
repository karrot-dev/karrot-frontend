import angular from "angular";
import uiRouter from "angular-ui-router";
import groupMenuComponent from "./groupMenu.component";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
