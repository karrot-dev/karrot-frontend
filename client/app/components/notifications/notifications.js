import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import User from "services/user/user";
import notificationsComponent from "./notifications.component";
import Authentication from "services/authentication/authentication";
import { loggedInOrRedirectToLogin } from "services/authentication/snippets";

let notificationsModule = angular.module("notifications", [
  uiRouter,
  ngMaterial,
  User,
  Authentication
])

.component("notifications", notificationsComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("notifications", {
      parent: "main",
      url: "/notifications",
      component: "notifications",
      resolve: {
        loggedInOrRedirectToLogin,
        userdata: (Authentication) => Authentication.update()
      },
      ncyBreadcrumb: {
        label: "{{'NOTIFICATIONS.TITLE' | translate}}"
      }
    });
})

.name;

export default notificationsModule;
