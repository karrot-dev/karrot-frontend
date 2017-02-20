import template from "./storeList.html";
import controller from "./storeList.controller";
import "./storeList.styl";

let storeListComponent = {
  bindings: {
    groupId: "<"
  },
  template,
  controller
};

export default storeListComponent;
