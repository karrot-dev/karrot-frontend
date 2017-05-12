import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import historyComponent from "./history.component";
import profilePicture from "../../_profilePicture/profilePicture";
import historyDetail from "./_historyDetail/historyDetail";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture,
  historyDetail
])

.component("history", historyComponent)


.name;

export default historyModule;
