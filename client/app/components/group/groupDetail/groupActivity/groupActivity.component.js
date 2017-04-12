import template from "./groupActivity.html";
import controller from "./groupActivity.controller";
import "./groupActivity.styl";

let groupActivityComponent = {
  restrict: "",
  bindings: {
    groupActivity: "<"
  },
  template,
  controller
};

export default groupActivityComponent;
