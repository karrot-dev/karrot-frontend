import angular from "angular";
import uiRouter from "angular-ui-router";
import storeList from "../../../_storeList/storeList";
import storesComponent from "./stores.component";

let storesModule = angular.module("stores", [
  uiRouter,
  storeList
])

.component("stores", storesComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.stores", {
      url: "/stores",
      views: {
        "detail@group.groupDetail": {
          component: "stores"
        }
      }
    });
})

.name;

export default storesModule;
