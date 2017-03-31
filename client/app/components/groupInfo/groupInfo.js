import angular from "angular";
import uiRouter from "angular-ui-router";
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
        label: "{{$ctrl.groupData.name}}"
      }
    });
})

.name;

export default groupInfoModule;
