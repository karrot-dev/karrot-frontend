import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import Authentication from "../../services/authentication/authentication";
import groupInfoComponent from "./groupInfo.component";
import groupModule from "../../services/group/group";
import "angular-simple-logger";
import "leaflet";
import "ui-leaflet";

let groupInfoModule = angular.module("groupInfo", [
  uiRouter,
  ngMaterial,
  Authentication,
  groupModule,
  "nemLogging",
  "ui-leaflet"
])

.component("groupInfo", groupInfoComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupInfo", {
      parent: "main",
      url: "/group-info/{groupId:int}",
      component: "groupInfo",
      resolve: {
        groupData: (GroupService, $stateParams) => {
          return GroupService.get($stateParams.groupId);
        }
      },
      ncyBreadcrumb: {
        // no idea if $resolve is stable API,
        // but $ctrl.groupData is only available in the child scope
        // (could be a bug of ncyBreadcrumb)
        label: "{{ $resolve.groupData.name }}"
      }
    });
})

.name;

export default groupInfoModule;
