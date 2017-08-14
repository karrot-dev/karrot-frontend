import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import GroupService from "services/group/group";
import chatComponent from "./chat.component";
import wallpost from "./_wallpost/wallpost";

let chatModule = angular.module("chat", [
  uiRouter,
  ngMaterial,
  GroupService,
  wallpost
])

.component("chat", chatComponent)

.directive("chatScrollTop", () => {
  return {
    scope: {
      chatScrollTop: "="
    },
    link: (scope, elements) => {
      let el = elements[0];
      scope.$watchCollection("chatScrollTop", (newValue) => {
        if (newValue) el.scrollTop = 0;
      });
    }
  };
})

.filter("reverse", () => {
  return (items) => {
    return items.slice().reverse();
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
