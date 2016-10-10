import template from "./groups.html";
import controller from "./groups.controller";
import "./groups.styl";

let groupsComponent = {
  bindings: {
    groupdata: "<"
  },
  template,
  controller,
  restrict: "E"
};

export default groupsComponent;
