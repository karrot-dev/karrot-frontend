import angular from "angular";
import uiRouter from "angular-ui-router";
import userListComponent from "./userList.component";

let userListModule = angular.module("userList", [
  uiRouter
])

.component("userList", userListComponent)

.name;

export default userListModule;
