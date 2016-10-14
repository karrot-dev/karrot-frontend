import angular from "angular";
import uiRouter from "angular-ui-router";
import homeComponent from "./home.component";
import logout from "./home.logout";
import hookFactory from "../../common/authentication/hook";

let hook = hookFactory("home", { authenticated: true, anonymous: "login" });

let homeModule = angular.module("home", [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state("home", {
      url: "/",
      component: "home"
    });
})

.run(hook)

.directive("logout", logout)

.component("home", homeComponent)

.name;

export default homeModule;
