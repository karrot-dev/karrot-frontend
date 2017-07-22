import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupOptionsComponent from "./groupOptions.component";
import GroupService from "services/group/group";

let groupOptionsModule = angular.module("groupOptions", [
  uiRouter,
  ngMaterial,
  GroupService
])

.component("groupOptions", groupOptionsComponent)

.name;

export default groupOptionsModule;
