import template from "./joinGroup.html";
import controller from "./joinGroup.controller";
import "./joinGroup.styl";

let joinGroupComponent = {
  bindings: {
    group: "<"
  },
  template,
  controller
};

export default joinGroupComponent;
