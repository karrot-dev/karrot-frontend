import template from "./topbar.html";
import controller from "./topbar.controller";
import "./topbar.styl";

let topbarComponent = {
  bindings: {
    activeGroup: "<"
  },
  template,
  controller
};

export default topbarComponent;
