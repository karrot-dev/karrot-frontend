import angular from "angular";
import uiRouter from "angular-ui-router";
import membersComponent from "./members.component";

let MembersModule = angular.module("members", [
  uiRouter
])

.component("members", membersComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail.members", {
      url: "/members",
      views: {
        "detail@groupDetail": {
          component: "members"
        }
      }
    });
})

.name;

export default MembersModule;
