import angular from "angular";
import uiRouter from "angular-ui-router";
import userDetailComponent from "./userDetail.component";

let userDetailModule = angular.module("userDetail", [
  uiRouter
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
          return User.get($stateParams.id).then((user) => {
            return user;
          });
        }
      }
    });
  hookProvider.setup("userDetail", { authenticated: true, anonymous: "login" });
})

.name;

export default userDetailModule;
