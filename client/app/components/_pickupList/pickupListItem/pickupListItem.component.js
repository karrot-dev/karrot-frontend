import template from "./pickupListItem.html";
import controller from "./pickupListItem.controller";
import "./pickupListItem.styl";

let pickupListItemComponent = {
  bindings: {
    data: "<",              // pickup info, including .isFull .isUserMember etc..
    showDetail: "<",        // same as in pickupList
    parentCtrl: "<"         // Controller of pickupList
  },
  template,
  controller
};

export default pickupListItemComponent;
