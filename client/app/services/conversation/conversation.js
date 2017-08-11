import Conversation from "./conversation.service";
import Message from "./message.service";
import Socket from "./socket.service";

let conversationModule = angular.module("Conversation", [])

.service("Conversation", Conversation)

.service("Message", Message)

.service("Socket", Socket)

.name;

export default conversationModule;
