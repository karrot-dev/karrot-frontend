import template from "./joinGroup.html";
import controller from "./joinGroup.controller";
import "./joinGroup.styl";

let joinGroupComponent = {
  bindings: {
    selectedGroup: "<"
  },
  template,
  controller
};

export default joinGroupComponent;
