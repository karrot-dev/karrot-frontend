import template from "./createPickup.html";
import controller from "./createPickup.controller";
import "./createPickup.styl";

let createPickupComponent = {
  bindings: {
    storeId: "<",
    pickuplistCtrl: "<"
  },
  template,
  controller
};

export default createPickupComponent;
