import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import historyDetailComponent from "./historyDetail.component";

let historyDetailModule = angular.module("historyDetail", [
  uiRouter
])

.component("historyDetail", historyDetailComponent)

.name;

export default historyDetailModule;
