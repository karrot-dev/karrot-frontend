import angular from "angular";
import uiRouter from "angular-ui-router";
import topbarComponent from "./topbar.component";

let topbarModule = angular.module("topbar", [
  uiRouter
])

.component("topbar", topbarComponent)

.name;

export default topbarModule;
