import angular from "angular";
import uiRouter from "angular-ui-router";
import activityComponent from "./activity.component";
import profilePicture from "../../_profilePicture/profilePicture";

let activityModule = angular.module("activity", [
  uiRouter,
  profilePicture
])

.component("activity", activityComponent)


.name;

export default activityModule;
