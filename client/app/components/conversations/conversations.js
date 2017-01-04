import angular from "angular";
import uiRouter from "angular-ui-router";
import conversationsComponent from "./conversations.component";
import ConversationsList from "./list/conversationsList";
import Conversation from "./conversation/conversation";


let conversationsModule = angular.module("conversations", [
  uiRouter,
  ConversationsList,
  Conversation
])

.component("conversations", conversationsComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("conversations", {
      parent: "main",
      url: "/conversations",
      component: "conversations",
      params: {
        threadView: false
      }
    })
    .state("conversation", {
      parent: "main",
      url: "/conversation/:id",
      component: "conversations",
      resolve: {
        threadView: () => true,
        conversationId: ($stateParams) => $stateParams.id
      }
    });
  hookProvider.setup("conversations", { authenticated: true, anonymous: "login" });
})

.name;

export default conversationsModule;
