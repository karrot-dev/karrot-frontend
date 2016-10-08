import angular from "angular";
import uiRouter from "angular-ui-router";
import signupComponent from "./signup.component";
import signupForm from "./signup.form";
import hookFactory from "../../common/authentication/hook";

let hook = hookFactory("signup", { authenticated: "home", anonymous: true });

let signupModule = angular.module("signup", [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider.state("signup", {
    url: "/signup",
    component: "signup"
  });
})

.run(hook)

.directive("signupForm", signupForm)

.component("signup", signupComponent)

.name;

export default signupModule;
