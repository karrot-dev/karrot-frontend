import angular from "angular";
import uiRouter from "angular-ui-router";
import userDetailComponent from "./userDetail.component";
import Authentication from "../../common/authentication/authentication";
import User from "../../common/user/user";

let userDetailModule = angular.module("userDetail", [
  uiRouter,
  Authentication,
  User
])

.component("userDetail", userDetailComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("userDetail", {
      parent: "main",
      url: "/user/{id:int}",
      component: "userDetail",
      resolve: {
        userdata: (User, $stateParams) => {
          return User.get($stateParams.id).then((user) => user);
        }
      },
      ncyBreadcrumb: {
        label: "{{$$childHead.$ctrl.userdata.display_name}}"
      }
    });
  hookProvider.setup("userDetail", { authenticated: true, anonymous: "login" });
})

.name;

export default userDetailModule;
