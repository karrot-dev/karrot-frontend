import template from "./activity.html";
import controller from "./activity.controller";
import "./activity.styl";

let activityComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default activityComponent;
