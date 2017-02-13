import angular from "angular";
import uiRouter from "angular-ui-router";
import createGroupComponent from "./createGroup.component";
import GroupService from "../../common/group/group";

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
        label: "{{'CREATEGROUP.TITLE' | translate}}"
      }
    });
  hookProvider.setup("createGroup", { authenticated: true, anonymous: "login" });
})

.name;

export default createGroupModule;
