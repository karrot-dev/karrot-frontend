import template from "./message.html";
import controller from "./message.controller";
import "./message.styl";

let messageComponent = {
  bindings: {
    author: "<",
    content: "<",
    time: "<",
    pending: "<",
    error: "<",
    withAuthor: "<"
  },
  template,
  controller
};

export default messageComponent;
