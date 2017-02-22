import template from "./profilePicture.html";
import controller from "./profilePicture.controller";
import "./profilePicture.styl";

let profilePictureComponent = {
  bindings: {
    userId: "<",
    identicon: "<",
    size: "<"
  },
  template,
  controller
};

export default profilePictureComponent;
