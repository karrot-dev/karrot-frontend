import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import storeService from "../../../services/store/store";
import pickupList from "../_pickupList/pickupList";
import storeEdit from "./storeEdit/storeEdit";
import storeCreate from "./storeCreate/storeCreate";
import pickupManage from "./pickupManage/pickupManage";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  storeService,
  pickupList,
  storeEdit,
  storeCreate,
  pickupManage
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.store.storeDetail", {
      component: "storeDetail"
    })
    .state("group.store", {
      url: "/store/{storeId:int}",
      redirectTo: "group.store.storeDetail",
      template: "<ui-view></ui-view>",
      resolve: {
        storedata: (Store, $stateParams) => {
          return Store.get($stateParams.storeId);
        }
      },
      ncyBreadcrumb: {
        label: "{{$$childHead.$ctrl.storedata.name}}"
      }
    });
})

.name;

export default storeDetailModule;
