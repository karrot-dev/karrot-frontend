import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import pickupListComponent from "./pickupList.component";
import pickupListItemComponent from "./pickupListItem/pickupListItem";
import createPickup from "../_createPickup/createPickup";
import StoreModule from "../../common/store/store";
import AuthenticationModule from "../../common/authentication/authentication";
import PickupDateModule from "../../common/pickupDate/pickupDate";

let pickupListModule = angular.module("pickupList", [
  uiRouter,
  ngMaterial,
  pickupListItemComponent,
  createPickup,
  AuthenticationModule,
  StoreModule,
  PickupDateModule
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
