import template from "./profilePicture.html";
import controller from "./profilePicture.controller";
import "./profilePicture.styl";

let profilePictureComponent = {
  bindings: {
    size: "<"
  },
  template,
  controller
};

export default profilePictureComponent;
