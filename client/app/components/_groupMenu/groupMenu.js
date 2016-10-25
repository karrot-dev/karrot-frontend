import angular from "angular";
import uiRouter from "angular-ui-router";
import groupMenuComponent from "./groupMenu.component";
import Group from "../../common/group/group";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter,
  Group
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
