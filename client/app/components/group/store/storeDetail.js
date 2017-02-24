import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";
import storeDetailMap from "./_storeDetailMap/storeDetailMap";
import storeService from "../../../services/store/store";
import pickupList from "../_pickupList/pickupList";
import storeEdit from "./storeEdit/storeEdit";
import storeCreate from "./storeCreate/storeCreate";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  storeDetailMap,
  storeService,
  pickupList,
  storeEdit,
  storeCreate
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.store", {
      url: "/store/{storeId:int}",
      component: "storeDetail",
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
