import angular from "angular";
import uiRouter from "angular-ui-router";
import loginComponent from "./login.component";
import loginForm from "./login.form";
import loginHook from "./login.hook";
import ngMessages from "angular-messages";

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

.run(loginHook)

.directive("loginForm", loginForm)

.component("login", loginComponent)

.name;

export default loginModule;
