import angular from "angular";
import uiRouter from "angular-ui-router";
import storesComponent from "./stores.component";

let storesModule = angular.module("stores", [
  uiRouter
])

.component("stores", storesComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail.stores", {
      url: "/stores",
      views: {
        "detail@groupDetail": {
          component: "stores"
        }
      }
    });
})

.name;

export default storesModule;
