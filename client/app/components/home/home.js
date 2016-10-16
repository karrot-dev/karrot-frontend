import angular from "angular";
import uiRouter from "angular-ui-router";
import homeComponent from "./home.component";
import logout from "./home.logout";

let homeModule = angular.module("home", [
  uiRouter
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("home", {
      url: "/",
      component: "home"
    });
  hookProvider.setup("home", { authenticated: true, anonymous: "login" });
})

.directive("logout", logout)

.component("home", homeComponent)

.name;

export default homeModule;
