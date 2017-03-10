import angular from "angular";
import uiRouter from "angular-ui-router";
import notificationComponent from "./notification.component";
import Authentication from "../../services/authentication/authentication";

let notificationModule = angular.module("notification", [
  uiRouter,
  Authentication
])

.component("notification", notificationComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("notification", {
      parent: "main",
      url: "/notifications",
      component: "notification",
      resolve: {
        userdata: (Authentication) => {
          return Authentication.update().then((user) => user);
        }
      },
      ncyBreadcrumb: {
        label: "{{'NOTIFICATIONS.TITLE' | translate}}"
      }
    });
  hookProvider.setup("notification", { authenticated: true, anonymous: "login" });
})

.name;

export default notificationModule;
