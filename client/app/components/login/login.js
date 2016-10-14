import angular from "angular";
import uiRouter from "angular-ui-router";
import loginComponent from "./login.component";
import loginForm from "./login.form";
import ngMessages from "angular-messages";
import hookFactory from "../../common/authentication/hook";

let hook = hookFactory("login", { authenticated: "home", anonymous: true });

let loginModule = angular.module("login", [
  uiRouter,
  ngMessages
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $stateProvider.state("login", {
    url: "/login",
    component: "login"
  });
  $urlRouterProvider.otherwise("/login");
})

.run(hook)

.directive("loginForm", loginForm)

.component("login", loginComponent)

.name;

export default loginModule;
