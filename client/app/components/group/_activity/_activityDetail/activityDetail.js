import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import activityDetailComponent from "./activityDetail.component";

let activityDetailModule = angular.module("activityDetail", [
  uiRouter,
  ngMaterial
])

.component("activityDetail", activityDetailComponent)

.name;

export default activityDetailModule;
