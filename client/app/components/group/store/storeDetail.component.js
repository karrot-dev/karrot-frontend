import template from "./storeDetail.html";
import controller from "./storeDetail.controller";
import "./storeDetail.styl";

let storeDetailComponent = {
  bindings: {
    storedata: "<"
  },
  restrict: "",
  template,
  controller
};

export default storeDetailComponent;
