import template from "./storeEdit.html";
import controller from "./storeEdit.controller";
import "./storeEdit.styl";

let storeEditComponent = {
  restrict: "",
  bindings: {
    storedata: "<"
  },
  template,
  controller
};

export default storeEditComponent;
