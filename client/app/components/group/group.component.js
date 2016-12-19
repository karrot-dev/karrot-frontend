import template from "./group.html";
import controller from "./group.controller";
import "./group.styl";

let groupComponent = {
  bindings: {
    groupData: "<"
  },
  template,
  controller,
  restrict: ""
};

export default groupComponent;
