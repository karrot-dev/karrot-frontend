import angular from "angular";
import groupDetail from "./groupDetail/groupDetail";
import home from "./home/home";
import login from "./login/login";
import signup from "./signup/signup";
import storeDetail from "./storeDetail/storeDetail";
import topbar from "./_topbar/topbar";

let componentModule = angular.module("app.components", [
  groupDetail,
  home,
  login,
  signup,
  storeDetail,
  topbar
]).name;

export default componentModule;
