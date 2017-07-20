import template from "./groupInvites.html";
import controller from "./groupInvites.controller";
import "./groupInvites.styl";

let groupInvitesComponent = {
  restrict: "",
  bindings: {
    groupInvitations: "<"
  },
  template,
  controller
};

export default groupInvitesComponent;
