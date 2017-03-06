import template from "./groupPopup.html";
import controller from "./groupPopup.controller";
import "./groupPopup.styl";

let groupPopupComponent = {
  bindings: {
    name: "@",
    memberCount: "@"
  },
  template,
  controller
};

export default groupPopupComponent;
