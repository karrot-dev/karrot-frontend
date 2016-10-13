import angular from "angular";
import login from "./login/login";
import home from "./home/home";
import signup from "./signup/signup";
import storeList from "./storeList/storeList";

let componentModule = angular.module("app.components", [
  login,
  home,
  signup,
  storeList
])

.name;

export default componentModule;
