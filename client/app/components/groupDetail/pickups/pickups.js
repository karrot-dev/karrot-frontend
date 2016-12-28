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
    .state("groupDetail.pickups", {
      url: "/pickups",
      views: {
        "detail@groupDetail": {
          component: "pickups"
        }
      }
    });
})

.name;

export default pickupsModule;
