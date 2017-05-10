import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import userList from "./_userList/userList";
import GroupService from "../../../../services/group/group";
import membersComponent from "./members.component";

let MembersModule = angular.module("members", [
  uiRouter,
  GroupService,
  userList
])

.component("members", membersComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.members", {
      url: "/members",
      component: "members",
      ncyBreadcrumb: {
        label: "{{'GROUP.MEMBERS' | translate}}"
      }
    });
})

.name;

export default MembersModule;
