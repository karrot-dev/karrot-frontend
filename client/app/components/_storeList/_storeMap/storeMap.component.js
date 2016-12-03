import template from "./storeMap.html";
import controller from "./storeMap.controller";
import "./storeMap.styl";

let storeMapComponent = {
  bindings: {
    storeList: "<"
  },
  template,
  controller
};

export default storeMapComponent;
