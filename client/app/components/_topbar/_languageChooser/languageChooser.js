import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import languageChooserComponent from "./languageChooser.component";

let languageChooserModule = angular.module("languageChooser", [
  uiRouter,
  ngMaterial
])

.component("languageChooser", languageChooserComponent)

.name;

export default languageChooserModule;
