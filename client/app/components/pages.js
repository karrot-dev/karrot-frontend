import angular from "angular";
import group from "./group/group";
import home from "./home/home";
import login from "./login/login";
import signup from "./signup/signup";
import userDetail from "./userDetail/userDetail";
import createGroup from "./createGroup/createGroup";
import topbar from "./_topbar/topbar";

let componentModule = angular.module("app.components", [
  group,
  home,
  login,
  signup,
  userDetail,
  createGroup,
  topbar
]).name;

export default componentModule;
