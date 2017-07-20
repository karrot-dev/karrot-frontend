import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupInvitesComponent from "./groupInvites.component";

let groupInvitesModule = angular.module("groupInvites", [
  uiRouter
])

.component("groupInvites", groupInvitesComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupInvites", {
      parent: "group",
      url: "/invites",
      component: "groupInvites",
      resolve: {
        groupInvitations: (Invitation, $stateParams) => Invitation.listByGroupId($stateParams.groupId)
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.INVITE' | translate}}"
      }
    });
})

.name;

export default groupInvitesModule;
