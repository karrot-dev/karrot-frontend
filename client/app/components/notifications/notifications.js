import angular from "angular";
import uiRouter from "angular-ui-router";
import notificationsComponent from "./notifications.component";
import Authentication from "../../services/authentication/authentication";

let notificationsModule = angular.module("notifications", [
  uiRouter,
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
