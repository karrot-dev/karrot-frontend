import angular from "angular";
import uiRouter from "angular-ui-router";
import historyComponent from "./history.component";
import profilePicture from "../../_profilePicture/profilePicture";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture
])

.component("history", historyComponent)


.name;

export default historyModule;
