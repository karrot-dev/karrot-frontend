import angular from "angular";
import uiRouter from "angular-ui-router";
import markdownInputComponent from "./markdownInput.component";

let markdownInputModule = angular.module("markdownInput", [
  uiRouter
])

.component("markdownInput", markdownInputComponent)

.name;

export default markdownInputModule;
