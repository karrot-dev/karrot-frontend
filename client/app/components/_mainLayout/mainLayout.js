import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import mainLayoutComponent from "./mainLayout.component";
import topbar from "../_topbar/topbar";

let mainLayoutModule = angular.module("mainLayout", [
  uiRouter,
  topbar
])

.component("mainLayout", mainLayoutComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("main", {
      abstract: true,
      url: "",
      component: "mainLayout"
    });
})

.name;

export default mainLayoutModule;
