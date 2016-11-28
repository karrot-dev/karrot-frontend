import template from "./userList.html";
import controller from "./userList.controller";
import "./userList.styl";

let userListComponent = {
  bindings: {
    users: "<"
  },
  template,
  controller
};

export default userListComponent;
