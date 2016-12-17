import angular from "angular";
import uiRouter from "angular-ui-router";
import membersComponent from "./members.component";

let MembersModule = angular.module("members", [
  uiRouter
])

.component("members", membersComponent)

.config(($stateProvider, hookProvider) => {
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
  hookProvider.setup("members", { authenticated: true, anonymous: "login" });
})

.name;

export default MembersModule;
