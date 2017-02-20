import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import groupMenuComponent from "./groupMenu.component";
import GroupService from "../../../services/group/group";
import logo from "../../_logo/logo";

let groupMenuModule = angular.module("groupMenu", [
  uiRouter,
  ngMaterial,
  GroupService,
  logo
])

.component("groupMenu", groupMenuComponent)

.name;

export default groupMenuModule;
