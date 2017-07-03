import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import createGroupComponent from "./createGroup.component";
import GroupService from "services/group/group";

let createGroupModule = angular.module("createGroup", [
  uiRouter,
  GroupService
])

.component("createGroup", createGroupComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("createGroup", {
      parent: "main",
      url: "/group/create",
      component: "createGroup",
      ncyBreadcrumb: {
        label: "{{'GROUP.CREATE_TITLE' | translate}}"
      }
    });
  hookProvider.setup("createGroup", { authenticated: true, anonymous: "login" });
})

.name;

export default createGroupModule;
