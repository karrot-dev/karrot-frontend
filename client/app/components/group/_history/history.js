import angular from "angular";
import uiRouter from "angular-ui-router";
import historyComponent from "./history.component";
import profilePicture from "../../_profilePicture/profilePicture";
import StoreModule from "../../../services/store/store";
import UserModule from "../../../services/user/user";

let historyModule = angular.module("history", [
  uiRouter,
  profilePicture,
  StoreModule,
  UserModule
])

.component("history", historyComponent)


.name;

export default historyModule;
