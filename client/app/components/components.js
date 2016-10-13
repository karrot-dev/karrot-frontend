import angular from "angular";
import login from "./login/login";
import home from "./home/home";
import signup from "./signup/signup";
import pickupList from "./pickupList/pickupList";
import pickupListItem from "./pickupList/pickupListItem/pickupListItem";

let componentModule = angular.module('app.components', [
  login,
  home,
  signup,
  pickupList,
  pickupListItem
])

.name;

export default componentModule;
