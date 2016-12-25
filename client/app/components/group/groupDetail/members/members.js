import angular from "angular";
import uiRouter from "angular-ui-router";
import userList from "../../../_userList/userList";
import membersComponent from "./members.component";

let MembersModule = angular.module("members", [
  uiRouter,
  userList
])

.component("members", membersComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.members", {
      url: "/members",
      views: {
        "detail@group.groupDetail": {
          component: "members"
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.MEMBERS' | translate}}"
      }
    });
})

.name;

export default MembersModule;
