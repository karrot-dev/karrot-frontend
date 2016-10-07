import angular from "angular";
import uiRouter from "angular-ui-router";
import signupComponent from "./signup.component";
import signupForm from "./signup.form";
import signupHook from "./signup.hook";

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

.run(signupHook)

.directive("signupForm", signupForm)

.component("signup", signupComponent)

.name;

export default signupModule;
