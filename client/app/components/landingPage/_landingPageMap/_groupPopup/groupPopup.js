import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupPopupComponent from "./groupPopup.component";
import GroupService from "services/group/group";

let groupPopupModule = angular.module("groupPopup", [
  uiRouter,
  GroupService
])

.component("groupPopup", groupPopupComponent)

.name;

export default groupPopupModule;
