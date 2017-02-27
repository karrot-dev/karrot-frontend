import angular from "angular";
import uiRouter from "angular-ui-router";
import landingPageMapComponent from "./landingPageMap.component";

let landingPageMapModule = angular.module("landingPageMap", [
  uiRouter
])

.component("landingPageMap", landingPageMapComponent)

.name;

export default landingPageMapModule;
