import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import homeComponent from "./home.component";
import GroupService from "services/group/group";
import joinGroup from "../_joinGroup/joinGroup";
import { loggedInOrRedirectToLogin } from "services/authentication/snippets";

let homeModule = angular.module("home", [
  uiRouter,
  GroupService,
  joinGroup
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("home", {
      parent: "main",
      url: "/",
      component: "home",
      resolve: {
        loggedInOrRedirectToLogin
      }
    });
})

.component("home", homeComponent)

.name;

export default homeModule;
