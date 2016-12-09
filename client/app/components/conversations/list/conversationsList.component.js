import template from "./conversationsList.html";
import controller from "./conversationsList.controller";
import "./conversationsList.styl";

let conversationsListComponent = {
  bindings: {
    active: "<",
    small: "<"
  },
  template,
  controller
};

export default conversationsListComponent;
