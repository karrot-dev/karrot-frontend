import angular from "angular";
import uiRouter from "angular-ui-router";
import StoreModule from "../../../../services/store/store";
import UserModule from "../../../../services/user/user";
import pickupListItemComponent from "./pickupListItem.component";

let pickupListItemModule = angular.module("pickupListItem", [
  uiRouter,
  StoreModule,
  UserModule
])

.component("pickupListItem", pickupListItemComponent)

.name;

export default pickupListItemModule;
