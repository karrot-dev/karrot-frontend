import template from "./activity.html";
import controller from "./activity.controller";
import "./activity.styl";

let activityComponent = {
  bindings: {
    data: "<",
    options: "<"
  },
  template,
  controller
};

export default activityComponent;
