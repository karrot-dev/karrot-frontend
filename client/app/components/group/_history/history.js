import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import historyComponent from "./history.component";
import profilePicture from "components/_profilePicture/profilePicture";
import historyDetail from "./_historyDetail/historyDetail";
import StoreModule from "services/store/store";
import UserModule from "services/user/user";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture,
  historyDetail,
  StoreModule,
  UserModule
])

.component("history", historyComponent)


.name;

export default historyModule;
