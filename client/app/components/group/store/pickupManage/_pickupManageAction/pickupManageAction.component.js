import template from "./pickupManageAction.html";
import controller from "./pickupManageAction.controller";
import "./pickupManageAction.styl";

let pickupManageActionComponent = {
  bindings: {
    flags: "<",
    data: "<",
    onEdit: "&",
    onDelete: "&"
  },
  template,
  controller
};

export default pickupManageActionComponent;
