import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import storeModule from "../../../common/store/store";
import groupModule from "../../../common/group/group";
import Geocoding from "../../../common/geocoding/geocoding";
import pickupList from "../../_pickupList/pickupList";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  storeModule,
  groupModule,
  Geocoding,
  pickupList
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.store", {
      url: "/store/{storeId:int}",
      views: {
        "mainView@group": {
          component: "storeDetail"
        }
      },
      resolve: {
        storedata: (Store, $stateParams) => {
          return Store.get($stateParams.storeId);
        }
      },
      ncyBreadcrumb: {
        label: '{{$$childHead.$ctrl.storedata.name}}'
      }
    });
})

.name;

export default storeDetailModule;
