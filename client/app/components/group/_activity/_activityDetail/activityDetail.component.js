import template from "./activityDetail.html";
import controller from "./activityDetail.controller";
import "./activityDetail.styl";

let activityDetailComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default activityDetailComponent;
