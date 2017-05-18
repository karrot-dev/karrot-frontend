import angular from "angular";
import uiRouter from "@uirouter/angularjs";
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
      component: "storeDetail",
      ncyBreadcrumb: {
        skip: true
      }
    })
    .state("group.store", {
      url: "/store/{storeId:int}",
      redirectTo: "group.store.storeDetail",
      template: "<ui-view></ui-view>",
      resolve: {
        storedata: (Store, CurrentStores, $stateParams) => {
          return Store.get($stateParams.storeId).then((store) => {
            return CurrentStores.setSelected(store);
          });
        }
      },
      ncyBreadcrumb: {
        // accesses group controller
        label: "{{ $ctrl.selectedStore.name }}"
      }
    });
})

.name;

export default storeDetailModule;
