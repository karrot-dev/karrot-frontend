import angular from "angular";
import groupDetail from "./groupDetail/groupDetail";
import home from "./home/home";
import login from "./login/login";
import signup from "./signup/signup";
import storeDetail from "./storeDetail/storeDetail";
import userDetail from "./userDetail/userDetail";
import createGroup from "./createGroup/createGroup";
import topbar from "./_topbar/topbar";
import conversations from "./conversations/conversations";

let componentModule = angular.module("app.components", [
  groupDetail,
  home,
  login,
  signup,
  storeDetail,
  userDetail,
  createGroup,
  topbar,
  conversations
]).name;

export default componentModule;
