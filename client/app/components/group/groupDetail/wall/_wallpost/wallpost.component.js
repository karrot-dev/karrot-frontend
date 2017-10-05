import template from "./wallpost.html";
import controller from "./wallpost.controller";
import "./wallpost.styl";

let wallpostComponent = {
  bindings: {
    message: "<"
  },
  template,
  controller
};

export default wallpostComponent;
