import template from "./groupList.html";
import controller from "./groupList.controller";
import "./groupList.styl";

let groupListComponent = {
  restrict: "",
  bindings: {
    groups: "<"
  },
  template,
  controller
};

export default groupListComponent;
