import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import User from "services/user/user";
import verifyMailComponent from "./verifyMail.component";
import { loggedInOrRedirectToLogin } from "services/authentication/snippets";

let verifyMailModule = angular.module("verifyMail", [
  uiRouter,
  User
])

.component("verifyMail", verifyMailComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("verifyMail", {
      parent: "main",
      url: "/verify-mail?key",
      component: "verifyMail",
      ncyBreadcrumb: {
        label: "{{'VERIFYMAIL.TITLE' | translate}}"
      },
      resolve: {
        loggedInOrRedirectToLogin
      }
    });
})

.name;

export default verifyMailModule;
