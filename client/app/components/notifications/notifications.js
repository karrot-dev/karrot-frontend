import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import User from "../../services/user/user";
import notificationsComponent from "./notifications.component";
import Authentication from "../../services/authentication/authentication";

let notificationsModule = angular.module("notifications", [
  uiRouter,
  ngMaterial,
  User,
  Authentication
])

.component("notifications", notificationsComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("notifications", {
      parent: "main",
      url: "/notifications",
      component: "notifications",
      resolve: {
        userdata: (Authentication) => {
          return Authentication.update().then((user) => user);
        }
      },
      ncyBreadcrumb: {
        label: "{{'NOTIFICATIONS.TITLE' | translate}}"
      }
    });
  hookProvider.setup("notifications", { authenticated: true, anonymous: "login" });
})

.name;

export default notificationsModule;
