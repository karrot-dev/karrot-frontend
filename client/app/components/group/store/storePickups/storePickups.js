import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Authentication from "../../../../services/authentication/authentication";
import pickupList from "../../_pickupList/pickupList";
import storePickupsComponent from "./storePickups.component";

let storePickupsModule = angular.module("storePickups", [
  uiRouter,
  pickupList,
  Authentication
])

.component("storePickups", storePickupsComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("storePickups", {
      parent: "group.store.storeDetail",
      url: "/pickups",
      component: "storePickups",
      ncyBreadcrumb: {
        label: "{{'GROUP.PICKUPS' | translate}}"
      }
    });
  hookProvider.setup("storePickups", { authenticated: true, anonymous: "login" });
})

.name;

export default storePickupsModule;
