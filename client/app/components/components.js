import angular from "angular";
import login from "./login/login";
import home from "./home/home";
import signup from "./signup/signup";
import topbar from "./topbar/topbar";
import userList from "./userList/userList";

let componentModule = angular.module("app.components", [
  login,
  groups,
  home,
  signup,
  topbar,
  userList
])

.name;

export default componentModule;
