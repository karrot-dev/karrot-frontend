import angular from "angular";
import login from "./login/login";
import groups from "./groups/groups";
import home from "./home/home";
import signup from "./signup/signup";
import topbar from "./topbar/topbar";
import pickupList from "./pickupList/pickupList";
import pickupListItem from "./pickupList/pickupListItem/pickupListItem";

let componentModule = angular.module("app.components", [
  login,
  groups,
  home,
  signup,
  topbar,
  pickupList,
  pickupListItem
])

.name;

export default componentModule;
