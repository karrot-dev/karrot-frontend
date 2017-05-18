import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import logoComponent from "./logo.component";

let logoModule = angular.module("logo", [
  uiRouter
])

.component("logo", logoComponent)

.name;

export default logoModule;
