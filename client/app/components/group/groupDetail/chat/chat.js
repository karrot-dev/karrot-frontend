import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import GroupService from "services/group/group";
import chatComponent from "./chat.component";

let chatModule = angular.module("chat", [
  uiRouter,
  ngMaterial,
  GroupService
])

.component("chat", chatComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.chat", {
      url: "/chat",
      component: "chat",
      ncyBreadcrumb: {
        label: "{{'GROUP.CHAT' | translate}}"
      }
    });
})

.name;

export default chatModule;
