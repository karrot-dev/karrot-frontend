import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import GroupService from "services/group/group";
import groupListComponent from "./groupList.component";

let groupListModule = angular.module("groupList", [
  uiRouter,
  GroupService
])

.component("groupList", groupListComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupList", {
      parent: "main",
      url: "/group-info",
      component: "groupList",
      resolve: {
        groups: (GroupService) => {
          return GroupService.list().then((allGroups) => {
            return allGroups.sort((a,b) => b.members.length - a.members.length);
          });
        }
      },
      ncyBreadcrumb: {
        label: "{{ 'JOINGROUP.WHICHGROUP' | translate }}"
      }
    });
})

.name;

export default groupListModule;
