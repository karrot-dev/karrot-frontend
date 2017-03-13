import template from "./notifications.html";
import controller from "./notifications.controller";
import "./notifications.styl";

let notificationsComponent = {
  restrict: "",
  bindings: {
    userdata: "<"
  },
  template,
  controller
};

export default notificationsComponent;
