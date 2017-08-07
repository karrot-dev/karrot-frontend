import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import loginComponent from "./login.component";
import ngMessages from "angular-messages";
import Authentication from "services/authentication/authentication";
import { loggedOutOrRedirectToHome } from "services/authentication/snippets";

let loginModule = angular.module("login", [
  uiRouter,
  ngMessages,
  Authentication
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider.state("login", {
    parent: "splash",
    url: "/login",
    component: "login",
    ncyBreadcrumb: {
      label: "{{'LOGIN.TITLE' | translate}}"
    },
    resolve: {
      loggedOutOrRedirectToHome
    }
  });

})

.component("login", loginComponent)

.name;

export default loginModule;
