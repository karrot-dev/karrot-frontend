import angular from "angular";
import uiRouter from "angular-ui-router";
import groupPopupComponent from "./groupPopup.component";

let groupPopupModule = angular.module("groupPopup", [
  uiRouter
])

.component("groupPopup", groupPopupComponent)

.name;

export default groupPopupModule;
