import angular from "angular";
import uiRouter from "angular-ui-router";
import historyComponent from "./history.component";
import profilePicture from "../../_profilePicture/profilePicture";
import historyService from "../../../services/history/history";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture,
  historyService
])

.component("history", historyComponent)


.name;

export default historyModule;
