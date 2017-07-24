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
import notifications from "./notifications/notifications";
import groupInfo from "./groupInfo/groupInfo";
import groupList from "./_groupList/groupList";
import mapPicker from "./_mapPicker/mapPicker";
import joinGroupList from "./joinGroupList/joinGroupList";
import mainLayout from "./_mainLayout/mainLayout";
import splashLayout from "./_splashLayout/splashLayout";

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
  notifications,
  groupInfo,
  groupList,
  mapPicker,
  joinGroupList,
  mainLayout,
  splashLayout
]).name;

export default componentModule;
