import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import User from "../../services/user/user";
import Authentication from "../../services/authentication/authentication";
import verifyMailComponent from "./verifyMail.component";

let verifyMailModule = angular.module("verifyMail", [
  uiRouter,
  User,
  Authentication
])

.component("verifyMail", verifyMailComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("verifyMail", {
      parent: "main",
      url: "/verify-mail?key",
      component: "verifyMail",
      resolve: {
        email: (Authentication) => {
          return Authentication.update().then((data) => data.email);
        },
        error: (User, $stateParams) => {
          return User.verifyMail($stateParams.key)
          .then(() => false)
          .catch((err) => err);
        }
      }
    });
  hookProvider.setup("verifyMail", { authenticated: true, anonymous: "login" });
})

.name;

export default verifyMailModule;
