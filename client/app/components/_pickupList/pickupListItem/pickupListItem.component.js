import template from "./pickupListItem.html";
import controller from "./pickupListItem.controller";
import "./pickupListItem.styl";

let pickupListItemComponent = {
  bindings: {
    pickupdata: "<",
    showDetail: "<",
    parentCtrl: "<"         // Controller of pickupList
  },
  template,
  controller
};

export default pickupListItemComponent;
