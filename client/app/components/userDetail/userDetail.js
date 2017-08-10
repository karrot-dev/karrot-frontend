import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import userDetailComponent from "./userDetail.component";
import Authentication from "services/authentication/authentication";
import User from "services/user/user";
import mapPicker from "components/_mapPicker/mapPicker";

let userDetailModule = angular.module("userDetail", [
  uiRouter,
  Authentication,
  User,
  mapPicker
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
        userdata: (User, $stateParams, $state) => {
          return User.get($stateParams.id).then((user) => user)
            .catch((error) => {
              if (error.status === 403) $state.go("login");
              $state.go("notFound");
            });
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
