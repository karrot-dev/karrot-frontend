import template from "./conversations.html";
import controller from "./conversations.controller";
import "./conversations.styl";

let conversationsComponent = {
  bindings: {
    threadView: "<",
    conversationId: "<"
  },
  restrict: "",
  template,
  controller
};

export default conversationsComponent;
