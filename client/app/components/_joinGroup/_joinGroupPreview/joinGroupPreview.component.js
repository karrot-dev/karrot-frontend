import template from "./joinGroupPreview.html";
import controller from "./joinGroupPreview.controller";
import "./joinGroupPreview.styl";

let joinGroupPreviewComponent = {
  bindings: {
    group: "<",
    onJoinGroup: "&"
  },
  template,
  controller
};

export default joinGroupPreviewComponent;
