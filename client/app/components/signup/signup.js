import angular from "angular";
import uiRouter from "angular-ui-router";
import signupComponent from "./signup.component";
import signupForm from "./signup.form";

let signupModule = angular.module("signup", [
  uiRouter
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider.state("signup", {
    url: "/signup",
    component: "signup"
  });
  hookProvider.setup("signup", { authenticated: "home", anonymous: true });
})

.directive("signupForm", signupForm)

.component("signup", signupComponent)

.name;

export default signupModule;
