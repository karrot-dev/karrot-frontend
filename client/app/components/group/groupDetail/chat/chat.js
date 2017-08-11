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

.directive("chatScrollBottom", () => {
  return {
    scope: {
      chatScrollBottom: "="
    },
    link: (scope, elements) => {
      let el = elements[0];
      scope.$watchCollection("chatScrollBottom", (newValue) => {
        if (newValue) el.scrollTop = el.scrollHeight;
      });
    }
  };
})

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
