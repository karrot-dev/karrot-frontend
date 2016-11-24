import Conversations from "./conversations.service";

let conversationsModule = angular.module("Conversations", [])

.service("Conversations", Conversations)

.name;

export default conversationsModule;
