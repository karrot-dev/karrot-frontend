import template from "./pickupListItem.html";
import controller from "./pickupListItem.controller";
import "./pickupListItem.styl";

let pickupListItemComponent = {
  bindings: {
    data: "<",              // pickup info, including  .isUserMember etc..
    showDetail: "<",        // same as in pickupList
    onDelete: "&",
    parentCtrl: "<",         // Controller of pickupList
    meta:"<"                //metadata for pickup including .isFull
  },
  template,
  controller
};

export default pickupListItemComponent;
