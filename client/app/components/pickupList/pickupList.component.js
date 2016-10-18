import template from "./pickupList.html";
import controller from "./pickupList.controller";
import "./pickupList.styl";

let pickupListComponent = {
  restrict: "E",
  bindings: {
    showCreateButton: "@",  // show create-pickup button
    header: "@",            // set custom headline
    showDetail: "@",        //
    groupId: "@",
    storeId: "@"
  },
  template,
  controller
};

export default pickupListComponent;
