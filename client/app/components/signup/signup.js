import angular from "angular";
import uiRouter from "angular-ui-router";
import signupComponent from "./signup.component";
import Authentication from "../../common/authentication/authentication";
import User from "../../common/user/user";

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
    component: "signup"
  });
  hookProvider.setup("signup", { authenticated: "home", anonymous: true });
})

.component("signup", signupComponent)

.name;

export default signupModule;
