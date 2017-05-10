import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import markdownInputComponent from "./markdownInput.component";

let markdownInputModule = angular.module("markdownInput", [
  uiRouter
])

.component("markdownInput", markdownInputComponent)

.name;

export default markdownInputModule;
