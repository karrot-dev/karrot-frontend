import angular from "angular";
import uiRouter from "angular-ui-router";
import expandablePanelComponent from "./expandablePanel.component";

let expandablePanelModule = angular.module("expandablePanel", [
  uiRouter
])

.component("expandablePanel", expandablePanelComponent)

.name;

export default expandablePanelModule;
