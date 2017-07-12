import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import storeService from "services/store/store";
import storeEdit from "./storeEdit/storeEdit";
import storeCreate from "./storeCreate/storeCreate";
import pickupManage from "./pickupManage/pickupManage";
import storeHistory from "./storeHistory/storeHistory";
import storePickups from "./storePickups/storePickups";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  storeService,
  storeEdit,
  storeCreate,
  pickupManage,
  storeHistory,
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
      redirectTo: (trans) => {
        let Store = trans.injector().get("Store");
        let $stateParams = trans.injector().get("$stateParams");
        return Store.get($stateParams.storeId)
        .then(() => {
          return "storePickups";
        })
        .catch((response) => {
          let $translate = trans.injector().get("$translate");
          let $mdToast = trans.injector().get("$mdToast");
          if (response.status === 404) {
            $translate("GLOBAL.NOT_FOUND").then((message) => {
              $mdToast.showSimple(message);
            });
            return "landingPage";
          }
          throw response;
        });
      },
      template: "<ui-view></ui-view>",
      resolve: {
        storedata: (CurrentStores, $stateParams) => {
          return CurrentStores.setSelected(
            CurrentStores.get($stateParams.storeId)
          );
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
