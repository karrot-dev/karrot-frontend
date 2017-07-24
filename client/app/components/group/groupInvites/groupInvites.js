import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupInvitesComponent from "./groupInvites.component";
import InvitationService from "services/invitation/invitation";

let groupInvitesModule = angular.module("groupInvites", [
  uiRouter,
  InvitationService
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
        label: "{{'GROUP.INVITE_TITLE' | translate}}"
      }
    });
})

.name;

export default groupInvitesModule;
