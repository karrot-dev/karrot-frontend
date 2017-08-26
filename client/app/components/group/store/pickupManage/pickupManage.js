import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import pickupDate from "services/pickupDate/pickupDate";
import pickupManageComponent from "./pickupManage.component";
import pickupManageAction from "./_pickupManageAction/pickupManageAction";
import pickupEditCreate from "../../_pickupEditCreate/pickupEditCreate";
import ScreenSizeModule from "services/screenSize/screenSize";

let pickupManageModule = angular.module("pickupManage", [
  uiRouter,
  ngMaterial,
  pickupDate,
  pickupManageAction,
  pickupEditCreate,
  ScreenSizeModule
])

.component("pickupManage", pickupManageComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("pickupManage", {
      url: "/manage",
      parent: "group.store",
      component: "pickupManage",
      resolve: {
        series: (PickupDateSeries, $stateParams, $state) => {
          return PickupDateSeries.listByStoreId($stateParams.storeId)
            .catch(() => $state.go("login"));  // one time is enough
        },
        pickups: (PickupDate, $stateParams) => {
          return PickupDate.listByStoreId($stateParams.storeId);
        }
      },
      ncyBreadcrumb: {
        label: "{{ 'PICKUPMANAGE.TITLE' | translate }}"
      }
    });
})

.name;

export default pickupManageModule;
