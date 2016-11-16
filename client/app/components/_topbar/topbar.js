import angular from "angular";
import uiRouter from "angular-ui-router";
import topbarComponent from "./topbar.component";
import groupMenu from "../_groupMenu/groupMenu";
import languageChooser from "../_languageChooser/languageChooser";

let topbarModule = angular.module("topbar", [
  uiRouter,
  groupMenu,
  languageChooser
])

.component("topbar", topbarComponent)

.name;

export default topbarModule;
