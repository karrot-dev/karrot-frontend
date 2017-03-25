import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import languageChooserComponent from "./languageChooser.component";

let languageChooserModule = angular.module("languageChooser", [
  uiRouter,
  ngMaterial
])

.component("languageChooser", languageChooserComponent)

.name;

export default languageChooserModule;
