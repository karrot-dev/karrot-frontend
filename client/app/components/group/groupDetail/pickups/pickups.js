import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupList from "../../../_pickupList/pickupList";
import pickupsComponent from "./pickups.component";

let pickupsModule = angular.module("pickups", [
  uiRouter,
  pickupList
])

.component("pickups", pickupsComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.pickups", {
      component: "pickups",
      ncyBreadcrumb: {
        label: "{{'GROUP.PICKUPS' | translate}}"
      }
    });
})

.name;

export default pickupsModule;
