import angular from "angular";
import StoreModule from "services/store/store";
import UserModule from "services/user/user";
import uiRouter from "@uirouter/angularjs";
import pickupListItemComponent from "./pickupListItem.component";

let pickupListItemModule = angular.module("pickupListItem", [
  uiRouter,
  StoreModule,
  UserModule
])

.component("pickupListItem", pickupListItemComponent)

.name;

export default pickupListItemModule;
