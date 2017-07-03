import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import userDetailComponent from "./userDetail.component";
import Authentication from "services/authentication/authentication";
import User from "services/user/user";

let userDetailModule = angular.module("userDetail", [
  uiRouter,
  Authentication,
  User
])

.component("userDetail", userDetailComponent)

.config(($stateProvider) => {
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
      data: {
        authRequired: true
      },
      ncyBreadcrumb: {
        label: "{{$$childHead.$ctrl.userdata.display_name}}"
      }
    });
})

.name;

export default userDetailModule;
