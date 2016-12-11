import angular from "angular";
import uiRouter from "angular-ui-router";
import conversationsListComponent from "./conversationsList.component";
import ConversationsModule from "../../../common/conversations/conversations";

let conversationsListModule = angular.module("conversationsList", [
  uiRouter,
  ConversationsModule
])

.component("conversationsList", conversationsListComponent)

.name;

export default conversationsListModule;
