import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import storeList from "../../_storeList/storeList";
import storesComponent from "./stores.component";

let storesModule = angular.module("stores", [
  uiRouter,
  ngMaterial,
  storeList
])

.component("stores", storesComponent)

.config(($stateProvider, $mdMediaProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.stores", {
      url: "/stores",
      redirectTo: () => {
        if ($mdMediaProvider.$get()("gt-sm")) {
          return "group";
        }
      },
      component: "stores"
    });
})

.name;

export default storesModule;
