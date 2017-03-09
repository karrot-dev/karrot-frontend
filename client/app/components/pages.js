import angular from "angular";
import group from "./group/group";
import home from "./home/home";
import login from "./login/login";
import signup from "./signup/signup";
import userDetail from "./userDetail/userDetail";
import verifyMail from "./verifyMail/verifyMail";
import passwordreset from "./passwordreset/passwordreset";
import topbar from "./_topbar/topbar";
import landingPage from "./landingPage/landingPage";
import notification from "./notification/notification";

let componentModule = angular.module("app.components", [
  group,
  home,
  login,
  signup,
  userDetail,
  verifyMail,
  passwordreset,
  topbar,
  landingPage,
  notification
]).name;

export default componentModule;
