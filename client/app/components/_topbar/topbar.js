import angular from "angular";
import uiRouter from "angular-ui-router";
import topbarComponent from "./topbar.component";
import groupMenu from "./_groupMenu/groupMenu";
import languageChooser from "./_languageChooser/languageChooser";
import Authentication from "../../services/authentication/authentication";
import logo from "../_logo/logo";

let topbarModule = angular.module("topbar", [
  uiRouter,
  groupMenu,
  languageChooser,
  Authentication,
  logo
])

.component("topbar", topbarComponent)

.name;

export default topbarModule;
