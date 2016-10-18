import template from "./groupDetail.html";
import controller from "./groupDetail.controller";
import "./groupDetail.styl";

let groupDetailComponent = {
  bindings: {
    groupdata: "<",
    stores: "<"
  },
  template,
  controller,
  restrict: "E"
};

export default groupDetailComponent;
