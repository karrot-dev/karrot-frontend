import template from "./storeHistory.html";
import controller from "./storeHistory.controller";
import "./storeHistory.styl";

let storeHistoryComponent = {
  restrict: "",
  bindings: {
    storeHistory: "<"
  },
  template,
  controller
};

export default storeHistoryComponent;
