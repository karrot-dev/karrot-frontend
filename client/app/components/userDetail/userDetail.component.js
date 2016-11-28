import template from "./userDetail.html";
import controller from "./userDetail.controller";
import "./userDetail.styl";

let userDetailComponent = {
  restrict: "",
  bindings: {
    userdata: "<"
  },
  template,
  controller
};

export default userDetailComponent;
