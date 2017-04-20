import template from "./groupInfo.html";
import controller from "./groupInfo.controller";
import "./groupInfo.styl";

let groupInfoComponent = {
  restrict: "",
  bindings: {
    groupData: "<"
  },
  template,
  controller
};

export default groupInfoComponent;
