import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import GroupService from "../../services/group/group";
import joinGroupComponent from "./joinGroup.component";

let joinGroupModule = angular.module("joinGroup", [
  uiRouter,
  ngMaterial,
  GroupService
])

.component("joinGroup", joinGroupComponent)

.name;

export default joinGroupModule;
