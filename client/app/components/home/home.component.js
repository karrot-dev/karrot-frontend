import template from "./home.html";
import controller from "./home.controller";
import "./home.styl";

let homeComponent = {
  restrict: "",
  bindings: {
    redirecting: "<",
    groups: "<"
  },
  template,
  controller
};

export default homeComponent;
