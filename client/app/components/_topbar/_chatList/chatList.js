import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import chatListComponent from "./chatList.component";

let chatListModule = angular.module("chatList", [
  uiRouter
])

.component("chatList", chatListComponent)

.name;

export default chatListModule;
