import angular from "angular";
import uiRouter from "angular-ui-router";
import userListComponent from "./userList.component";
import User from "../../../../../services/user/user.js";

let userListModule = angular.module("userList", [
  uiRouter,
  User
])

.component("userList", userListComponent)

.name;

export default userListModule;
