import template from "./groupOptions.html";
import controller from "./groupOptions.controller";
import "./groupOptions.styl";

let groupOptionsComponent = {
  bindings: {
    groupData: "<"
  },
  template,
  controller
};

export default groupOptionsComponent;
