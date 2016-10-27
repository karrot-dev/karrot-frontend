import angular from "angular";
import uiRouter from "angular-ui-router";
import homeComponent from "./home.component";
import logout from "./home.logout";
import Group from "../../common/group/group";

let homeModule = angular.module("home", [
  uiRouter,
  Group
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("home", {
      parent: "main",
      url: "/",
      component: "home"
    });
  hookProvider.setup("home", { authenticated: true, anonymous: "login" });
})

.directive("logout", logout)

.component("home", homeComponent)

.name;

export default homeModule;
