import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import createGroupComponent from "./createGroup.component";
import GroupService from "services/group/group";
import { loggedInOrRedirectToLogin } from "services/authentication/snippets";

let createGroupModule = angular.module("createGroup", [
  uiRouter,
  GroupService
])

.component("createGroup", createGroupComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("createGroup", {
      parent: "main",
      url: "/group/create",
      component: "createGroup",
      ncyBreadcrumb: {
        label: "{{'GROUP.CREATE_TITLE' | translate}}"
      },
      resolve: {
        loggedInOrRedirectToLogin
      }
    });
})

.name;

export default createGroupModule;
