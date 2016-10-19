import template from "./pickupList.html";
import controller from "./pickupList.controller";
import "./pickupList.styl";

let pickupListComponent = {
  bindings: {
    showCreateButton: "@",  // show create-pickup button
    header: "@",            // set custom headline
    showDetail: "@",        // default: date; other options: "store" 
    groupId: "@",
    storeId: "@"
  },
  template,
  controller
};

export default pickupListComponent;
