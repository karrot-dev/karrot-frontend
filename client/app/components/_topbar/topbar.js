import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import topbarComponent from "./topbar.component";
import groupMenu from "./_groupMenu/groupMenu";
import chatList from "./_chatList/chatList";
import languageChooser from "./_languageChooser/languageChooser";
import Authentication from "services/authentication/authentication";
import logo from "components/_logo/logo";

let topbarModule = angular.module("topbar", [
  uiRouter,
  groupMenu,
  languageChooser,
  Authentication,
  logo,
  chatList
])

.component("topbar", topbarComponent)

.name;

export default topbarModule;
