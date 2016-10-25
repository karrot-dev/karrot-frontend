import template from "./groupMenu.html";
import controller from "./groupMenu.controller";
import "./groupMenu.styl";

let groupMenuComponent = {
  bindings: {
    activeGroup: "<"
  },
  template,
  controller
};

export default groupMenuComponent;
