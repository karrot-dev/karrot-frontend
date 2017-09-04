import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import wallpostComponent from "./wallpost.component";

let wallpostModule = angular.module("wallpost", [
  uiRouter
])

.component("wallpost", wallpostComponent)

.name;

export default wallpostModule;
