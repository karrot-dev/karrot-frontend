import template from "./pickupList.html";
import controller from "./pickupList.controller";
import "./pickupList.styl";

let pickupListComponent = {
  bindings: {
    groupId: "<",
    storeId: "<",
    options: "<"
  },
  template,
  controller
};

export default pickupListComponent;
