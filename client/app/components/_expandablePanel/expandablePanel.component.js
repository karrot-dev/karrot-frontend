import template from "./expandablePanel.html";
import controller from "./expandablePanel.controller";
import "./expandablePanel.styl";

let expandablePanelComponent = {
  bindings: {
    content: "<",
    markdown: "<",
    collapse: "<"
  },
  template,
  controller
};

export default expandablePanelComponent;
