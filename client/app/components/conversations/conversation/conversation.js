import angular from "angular";
import uiRouter from "angular-ui-router";
import conversationComponent from "./conversation.component";
import ConversationsModule from "../../../common/conversations/conversations";
import Message from "../message/message";


let conversationModule = angular.module("conversation", [
  uiRouter,
  ConversationsModule,
  Message
])

.component("conversation", conversationComponent)

.name;

export default conversationModule;
