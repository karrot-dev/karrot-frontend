import angular from "angular";
import uiRouter from "angular-ui-router";
import notificationComponent from "./notification.component";
import Authentication from "../../services/authentication/authentication";
import User from "../../services/user/user";

let notificationModule = angular.module("notification", [
  uiRouter,
  Authentication,
  User
])

.component("notification", notificationComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("notification", {
      parent: "main",
      url: "/notification/user/{id:int}",
      component: "notification",
      resolve: {
        userdata: (User, $stateParams) => {
          return User.get($stateParams.id).then((user) => user);
        }
      },
      ncyBreadcrumb: {
        label: "{{$$childHead.$ctrl.userdata.display_name}}"
      }
    });
  hookProvider.setup("notification", { authenticated: true, anonymous: "login" });
})

.name;

export default notificationModule;
