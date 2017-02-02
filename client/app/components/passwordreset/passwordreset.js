import angular from "angular";
import uiRouter from "angular-ui-router";
import User from "../../common/user/user";
import passwordresetComponent from "./passwordreset.component";

let passwordresetModule = angular.module("passwordreset", [
  uiRouter,
  User
])

.component("passwordreset", passwordresetComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("passwordreset", {
      parent: "splash",
      url: "/passwordreset",
      component: "passwordreset"
    });
})

.name;

export default passwordresetModule;
