import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import signupComponent from "./signup.component";
import Authentication from "../../services/authentication/authentication";
import User from "../../services/user/user";

let signupModule = angular.module("signup", [
  uiRouter,
  Authentication,
  User
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider.state("signup", {
    parent: "splash",
    url: "/signup",
    component: "signup",
    ncyBreadcrumb: {
      label: "{{ 'SIGNUP.TITLE' | translate}}"
    }
  });
  hookProvider.setup("signup", { authenticated: "home", anonymous: true });
})

.component("signup", signupComponent)

.name;

export default signupModule;
