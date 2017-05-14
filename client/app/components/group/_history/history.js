import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import historyComponent from "./history.component";
import profilePicture from "../../_profilePicture/profilePicture";
import historyDetail from "./_historyDetail/historyDetail";
import StoreService from "../../../services/store/store";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture,
  historyDetail,
  StoreService
])

.component("history", historyComponent)


.name;

export default historyModule;
