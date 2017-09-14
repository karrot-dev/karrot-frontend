import template from "./wall.html";
import controller from "./wall.controller";
import "./wall.styl";

let wallComponent = {
  restrict: "",
  bindings: {
    groupHistory: "<"
  },
  template,
  controller
};

export default wallComponent;
