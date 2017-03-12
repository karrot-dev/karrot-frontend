import template from "./notification.html";
import controller from "./notification.controller";
import "./notification.styl";

let notificationComponent = {
  restrict: "",
  bindings: {
    userdata: "<"
  },
  template,
  controller
};

export default notificationComponent;
