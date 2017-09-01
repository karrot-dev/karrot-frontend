import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import activityComponent from "./activity.component";
import profilePicture from "components/_profilePicture/profilePicture";
import activityDetail from "./_activityDetail/activityDetail";
import StoreModule from "services/store/store";
import UserModule from "services/user/user";

let activityModule = angular.module("activity", [
  uiRouter,
  profilePicture,
  activityDetail,
  StoreModule,
  UserModule
])

.component("activity", activityComponent)


.name;

export default activityModule;
