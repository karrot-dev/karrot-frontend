import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Authentication from "../../services/authentication/authentication";
import notFoundComponent from "./notFound.component";

let notFoundModule = angular.module("notFound", [
  uiRouter,
  Authentication
])

.component("notFound", notFoundComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("notFound", {
      parent: "main",
      url: "/not-found",
      component: "notFound"
    });
  hookProvider.setup("notFound", { authenticated: true, anonymous: "login" });
})

.name;

export default notFoundModule;
