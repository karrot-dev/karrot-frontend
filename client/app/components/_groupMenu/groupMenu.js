import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import groupMenuComponent from "./groupMenu.component";
import Group from "../../common/group/group";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter,
  ngMaterial,
  Group
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
