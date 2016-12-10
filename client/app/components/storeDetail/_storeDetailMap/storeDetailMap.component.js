import template from "./storeDetailMap.html";
import controller from "./storeDetailMap.controller";
import "./storeDetailMap.styl";

let storeDetailMapComponent = {
  bindings: {
    storeData: "<"
  },
  template,
  controller
};

export default storeDetailMapComponent;
