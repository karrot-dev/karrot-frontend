import template from "./pickupEditCreate.html";
import controller from "./pickupEditCreate.controller";
import "./pickupEditCreate.styl";

let pickupEditCreateComponent = {
  bindings: {
    data: "<"
  },
  template,
  controller
};

export default pickupEditCreateComponent;
