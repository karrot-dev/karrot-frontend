import template from "./joinGroupList.html";
import controller from "./joinGroupList.controller";
import "./joinGroupList.styl";

let joinGroupListComponent = {
  restrict: "",
  bindings: {
    groups: "<"
  },
  template,
  controller
};

export default joinGroupListComponent;
