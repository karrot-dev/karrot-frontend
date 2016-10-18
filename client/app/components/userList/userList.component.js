import template from "./userList.html";
import controller from "./userList.controller";
import "./userList.styl";

let userListComponent = {
  restrict: "E",
  bindings: {
    showEdit: "@",
    users: "<",
    callback: "<"
  },
  template,
  controller
};

export default userListComponent;
