import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import signupComponent from "./signup.component";
import Authentication from "services/authentication/authentication";
import User from "services/user/user";

let signupModule = angular.module("signup", [
  uiRouter,
  Authentication,
  User
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider.state("signup", {
    parent: "splash",
    url: "/signup",
    component: "signup",
    ncyBreadcrumb: {
      label: "{{ 'SIGNUP.TITLE' | translate}}"
    }
  });
})

.component("signup", signupComponent)

.name;

export default signupModule;
