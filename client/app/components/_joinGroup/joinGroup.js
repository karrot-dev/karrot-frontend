import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import GroupService from "../../common/group/group";
import joinGroupPreview from "./_joinGroupPreview/joinGroupPreview";
import joinGroupComponent from "./joinGroup.component";

let joinGroupModule = angular.module("joinGroup", [
  uiRouter,
  ngMaterial,
  joinGroupPreview,
  GroupService
])

.component("joinGroup", joinGroupComponent)

.name;

export default joinGroupModule;
