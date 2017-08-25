import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import storeService from "services/store/store";
import storeEdit from "./storeEdit/storeEdit";
import storeCreate from "./storeCreate/storeCreate";
import pickupManage from "./pickupManage/pickupManage";
import storeActivity from "./storeActivity/storeActivity";
import storePickups from "./storePickups/storePickups";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  storeService,
  storeEdit,
  storeCreate,
  pickupManage,
  storeActivity,
  storePickups
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.store.storeDetail", {
      abstract: true,
      component: "storeDetail",
      ncyBreadcrumb: {
        skip: true
      }
    })
    .state("group.store", {
      url: "/store/{storeId:int}",
      redirectTo: "storePickups",
      template: "<ui-view></ui-view>",
      resolve: {
        storedata: (Store, CurrentStores, $stateParams, $state) => {
          return Store.get($stateParams.storeId).then((store) => {
            return CurrentStores.setSelected(store);
          })
            .catch((error) => {
              if (error.status === 403) $state.go("login");
              $state.go("notFound");
            });
        }
      },
      ncyBreadcrumb: {
        // accesses group or storeDetail controller, depending on the child state
        label: "{{ $ctrl.selectedStore.name }}"
      }
    });
})

.name;

export default storeDetailModule;
