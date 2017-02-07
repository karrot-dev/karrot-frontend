import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import groupMenuComponent from "./groupMenu.component";
import GroupService from "../../common/group/group";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter,
  ngMaterial,
  GroupService
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
