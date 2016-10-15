import angular from "angular";
import uiRouter from "angular-ui-router";
import loginComponent from "./login.component";
import ngMessages from "angular-messages";

let loginModule = angular.module("login", [
  uiRouter,
  ngMessages
])

.config(($stateProvider, $urlRouterProvider, hookProvider) => {
  "ngInject";
  $stateProvider.state("login", {
    url: "/login",
    component: "login"
  });
  $urlRouterProvider.otherwise("/login");
  hookProvider.setup("login", { authenticated: "home", anonymous: true });
})

.component("login", loginComponent)

.name;

export default loginModule;
