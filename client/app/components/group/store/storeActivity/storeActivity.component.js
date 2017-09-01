import template from "./storeActivity.html";
import controller from "./storeActivity.controller";
import "./storeActivity.styl";

let storeActivityComponent = {
  restrict: "",
  bindings: {
    storeActivity: "<"
  },
  template,
  controller
};

export default storeActivityComponent;
