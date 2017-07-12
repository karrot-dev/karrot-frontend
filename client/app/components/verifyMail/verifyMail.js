import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import User from "services/user/user";
import Authentication from "services/authentication/authentication";
import verifyMailComponent from "./verifyMail.component";

let verifyMailModule = angular.module("verifyMail", [
  uiRouter,
  User,
  Authentication
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
      data: {
        authRequired: true
      }
    });
})

.name;

export default verifyMailModule;
