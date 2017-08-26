import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import topbarComponent from "./topbar.component";
import groupMenu from "./_groupMenu/groupMenu";
import languageChooser from "./_languageChooser/languageChooser";
import Authentication from "services/authentication/authentication";
import logo from "components/_logo/logo";
import ScreenSizeModule from "services/screenSize/screenSize";

let topbarModule = angular.module("topbar", [
  uiRouter,
  groupMenu,
  languageChooser,
  Authentication,
  logo,
  ScreenSizeModule
])

.component("topbar", topbarComponent)

.name;

export default topbarModule;
