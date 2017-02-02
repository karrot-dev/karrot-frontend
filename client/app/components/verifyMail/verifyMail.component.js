import template from "./verifyMail.html";
import controller from "./verifyMail.controller";
import "./verifyMail.styl";

let verifyMailComponent = {
  restrict: "",
  bindings: {
    email: "<",
    error: "<"
  },
  template,
  controller
};

export default verifyMailComponent;
