import template from "./historyDetail.html";
import controller from "./historyDetail.controller";
import "./historyDetail.styl";

let historyDetailComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default historyDetailComponent;
