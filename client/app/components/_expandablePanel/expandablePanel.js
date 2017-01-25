import angular from "angular";
import uiRouter from "angular-ui-router";
import angularSanitize from "angular-sanitize";
import expandablePanelComponent from "./expandablePanel.component";

let expandablePanelModule = angular.module("expandablePanel", [
  uiRouter,
  angularSanitize
])

.component("expandablePanel", expandablePanelComponent)

.name;

export default expandablePanelModule;
