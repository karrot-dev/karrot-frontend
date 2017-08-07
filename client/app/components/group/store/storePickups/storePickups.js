import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import pickupList from "../../_pickupList/pickupList";
import storePickupsComponent from "./storePickups.component";

let storePickupsModule = angular.module("storePickups", [
  uiRouter,
  pickupList
])

.component("storePickups", storePickupsComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("storePickups", {
      parent: "group.store.storeDetail",
      url: "/pickups",
      component: "storePickups",
      ncyBreadcrumb: {
        label: "{{'GROUP.PICKUPS' | translate}}"
      },
      authCheck: "group"
    });
})

.name;

export default storePickupsModule;
