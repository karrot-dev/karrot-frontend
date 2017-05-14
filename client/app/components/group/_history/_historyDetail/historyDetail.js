import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import historyDetailComponent from "./historyDetail.component";

let historyDetailModule = angular.module("historyDetail", [
  uiRouter,
  ngMaterial
])

.component("historyDetail", historyDetailComponent)

.name;

export default historyDetailModule;
