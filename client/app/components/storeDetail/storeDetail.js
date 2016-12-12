import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import AuthenticationModule from "../../common/authentication/authentication";
import storeModule from "../../common/store/store";
import groupModule from "../../common/group/group";
import Geocoding from "../../common/geocoding/geocoding";
import pickupList from "../_pickupList/pickupList";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  AuthenticationModule,
  storeModule,
  groupModule,
  Geocoding,
  pickupList
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("storeDetail", {
      parent: "main",
      url: "/group/{groupId:int}/store/{storeId:int}",
      component: "storeDetail",
      resolve: {
        storedata: (Store, $stateParams) => {
          return Store.get($stateParams.storeId);
        },
        groupdata: (Group, CurrentGroup, $stateParams) => {
          return Group.get($stateParams.groupId).then((group) => {
            CurrentGroup.set(group);
            return group;
          });
        }
      }
    });
  hookProvider.setup("storeDetail", { authenticated: true, anonymous: "login" });
})

.name;

export default storeDetailModule;
