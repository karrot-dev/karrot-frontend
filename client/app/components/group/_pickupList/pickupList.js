import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import pickupListComponent from "./pickupList.component";
import pickupListItemComponent from "./pickupListItem/pickupListItem";
import pickupEditCreate from "../_pickupEditCreate/pickupEditCreate";
import StoreModule from "services/store/store";
import AuthenticationModule from "services/authentication/authentication";
import PickupDateModule from "services/pickupDate/pickupDate";
import ScreenSizeModule from "services/screenSize/screenSize";

let pickupListModule = angular.module("pickupList", [
  uiRouter,
  ngMaterial,
  pickupListItemComponent,
  pickupEditCreate,
  AuthenticationModule,
  StoreModule,
  PickupDateModule,
  ScreenSizeModule
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
