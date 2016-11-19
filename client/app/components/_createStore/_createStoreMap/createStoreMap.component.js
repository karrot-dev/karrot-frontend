import template from "./createStoreMap.html";
import controller from "./createStoreMap.controller";
import "./createStoreMap.styl";

let createStoreMapComponent = {
  bindings: {
    address: "=",
    latitude: "=",
    longitude: "="
  },
  template,
  controller
};

export default createStoreMapComponent;
