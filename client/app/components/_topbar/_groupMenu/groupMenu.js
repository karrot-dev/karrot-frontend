import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupMenuComponent from "./groupMenu.component";
import GroupService from "services/group/group";
import logo from "components/_logo/logo";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter,
  ngMaterial,
  GroupService,
  logo
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
