import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupsComponent from "./pickups.component";

let pickupsModule = angular.module("pickups", [
  uiRouter
])

.component("pickups", pickupsComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.pickups", {
      url: "/pickups",
      views: {
        "detail@group.groupDetail": {
          component: "pickups"
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.PICKUPS' | translate}}"
      }
    });
})

.name;

export default pickupsModule;
