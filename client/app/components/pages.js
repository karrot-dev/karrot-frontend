import angular from "angular";
import group from "./group/group";
import home from "./home/home";
import login from "./login/login";
import signup from "./signup/signup";
import userDetail from "./userDetail/userDetail";
import verifyMail from "./verifyMail/verifyMail";
import passwordreset from "./passwordreset/passwordreset";
import topbar from "./_topbar/topbar";

let componentModule = angular.module("app.components", [
  group,
  home,
  login,
  signup,
  userDetail,
  verifyMail,
  passwordreset,
  topbar
]).name;

export default componentModule;
