import template from "./createPickup.html";
import controller from "./createPickup.controller";
import "./createPickup.styl";

let createPickupComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default createPickupComponent;
