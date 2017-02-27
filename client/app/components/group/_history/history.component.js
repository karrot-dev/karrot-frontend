import template from "./history.html";
import controller from "./history.controller";
import "./history.styl";

let historyComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default historyComponent;
