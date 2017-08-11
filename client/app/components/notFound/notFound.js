import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import notFoundComponent from "./notFound.component";

let notFoundModule = angular.module("notFound", [
  uiRouter
])

.component("notFound", notFoundComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("notFound", {
      parent: "main",
      url: "/not-found",
      component: "notFound"
    });
})

.name;

export default notFoundModule;
