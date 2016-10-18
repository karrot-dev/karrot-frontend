import angular from "angular";
import groupDetail from "./groupDetail/groupDetail";
import home from "./home/home";
import login from "./login/login";
import pickupList from "./_pickupList/pickupList";
import pickupListItem from "./_pickupList/pickupListItem/pickupListItem";
import signup from "./signup/signup";
import storeList from "./_storeList/storeList";
import topbar from "./_topbar/topbar";
import userList from "./_userList/userList";

let componentModule = angular.module("app.components", [
  groupDetail,
  home,
  login,
  pickupList,
  pickupListItem,
  signup,
  storeList,
  topbar,
  userList
])

.name;

export default componentModule;
