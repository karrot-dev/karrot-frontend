import angular from "angular";
import uiRouter from "angular-ui-router";
import signupComponent from "./signup.component";

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

.component("signup", signupComponent)

.name;

export default signupModule;
