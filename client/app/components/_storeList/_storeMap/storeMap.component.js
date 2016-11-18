import template from "./storeMap.html";
import controller from "./storeMap.controller";
import "./storeMap.styl";

let storeMapComponent = {
  bindings: {
    storeData: "<"
  },
  template,
  controller
};

export default storeMapComponent;
