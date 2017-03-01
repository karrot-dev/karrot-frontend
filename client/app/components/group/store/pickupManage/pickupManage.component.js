import template from "./pickupManage.html";
import controller from "./pickupManage.controller";
import "./pickupManage.styl";

let pickupManageComponent = {
  restrict: "",
  bindings: {
    series: "<",
    pickups: "<"
  },
  template,
  controller
};

export default pickupManageComponent;
