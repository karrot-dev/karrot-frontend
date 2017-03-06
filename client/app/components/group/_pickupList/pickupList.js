import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import pickupListComponent from "./pickupList.component";
import pickupListItemComponent from "./pickupListItem/pickupListItem";
import pickupEditCreate from "./../_pickupEditCreate/pickupEditCreate";
import StoreModule from "../../../services/store/store";
import AuthenticationModule from "../../../services/authentication/authentication";
import PickupDateModule from "../../../services/pickupDate/pickupDate";

let pickupListModule = angular.module("pickupList", [
  uiRouter,
  ngMaterial,
  pickupListItemComponent,
  pickupEditCreate,
  AuthenticationModule,
  StoreModule,
  PickupDateModule
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
