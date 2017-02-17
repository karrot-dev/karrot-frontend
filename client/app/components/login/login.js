import angular from "angular";
import uiRouter from "angular-ui-router";
import loginComponent from "./login.component";
import ngMessages from "angular-messages";
import Authentication from "../../common/authentication/authentication";

let loginModule = angular.module("login", [
  uiRouter,
  ngMessages,
  Authentication
])

.config(($stateProvider, $urlRouterProvider, hookProvider) => {
  "ngInject";
  $stateProvider.state("login", {
    parent: "splash",
    url: "/login",
    component: "login",
    ncyBreadcrumb: {
      label: "{{'LOGIN.TITLE' | translate}}"
    }
  });
  $urlRouterProvider.otherwise("/login");
  hookProvider.setup("login", { authenticated: "home", anonymous: true });
})

.component("login", loginComponent)

.name;

export default loginModule;
