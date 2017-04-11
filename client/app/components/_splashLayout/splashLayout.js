import angular from "angular";
import uiRouter from "angular-ui-router";
import splashLayoutComponent from "./splashLayout.component";
import logo from "../_logo/logo";

let splashLayoutModule = angular.module("splashLayout", [
  uiRouter,
  logo
])

.component("splashLayout", splashLayoutComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("splash", {
      abstract: true,
      url: "",
      component: "splashLayout"
    });
})

.name;

export default splashLayoutModule;
