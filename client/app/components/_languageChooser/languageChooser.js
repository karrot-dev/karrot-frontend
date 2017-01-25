import angular from "angular";
import uiRouter from "angular-ui-router";
import translate from "angular-translate";
import languageChooserComponent from "./languageChooser.component";

let languageChooserModule = angular.module("languageChooser", [
  uiRouter,
  translate
])

.component("languageChooser", languageChooserComponent)

.name;

export default languageChooserModule;
