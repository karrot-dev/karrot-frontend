import template from "./landingPageMap.html";
import controller from "./landingPageMap.controller";
import "./landingPageMap.styl";

let landingPageMapComponent = {
  bindings: {
    groups: "<"
  },
  template,
  controller
};

export default landingPageMapComponent;
