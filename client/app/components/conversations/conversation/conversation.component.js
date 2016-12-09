import template from "./conversation.html";
import controller from "./conversation.controller";
import "./conversation.styl";

let conversationComponent = {
  bindings: {
    id: '<'
  },
  template,
  controller
};

export default conversationComponent;
