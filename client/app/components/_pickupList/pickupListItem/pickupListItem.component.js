import template from "./pickupListItem.html";
import controller from "./pickupListItem.controller";
import "./pickupListItem.styl";

let pickupListItemComponent = {
  bindings: {
    data: "<",              // pickup info, including .isFull .isMember etc..
    showDetail: "<",        // 'store'
    parentCtrl: "<"         // Controller of pickupList
  },
  template,
  controller
};

export default pickupListItemComponent;
