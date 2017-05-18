import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import User from "../../services/user/user";
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
      component: "passwordreset",
      ncyBreadcrumb: {
        label: "{{'PASSWORDRESET.TITLE' | translate}}"
      }
    });
})

.name;

export default passwordresetModule;
