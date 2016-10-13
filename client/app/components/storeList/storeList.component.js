import template from "./storeList.html";
import controller from "./storeList.controller";
import "./storeList.styl";

let storeListComponent = {
  restrict: "E",
  bindings: {
    showEdit: "@",
    stores: "<",
    callback: "<"
  },
  template,
  controller
};

export default storeListComponent;
