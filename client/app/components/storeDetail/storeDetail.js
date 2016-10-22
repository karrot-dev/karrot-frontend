import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("storeDetail", {
      url: "/store/:id",
      component: "storeDetail",
      resolve: {
        storedata: (Store, $stateParams) => {
          return Store.get({ "id": $stateParams.id });
        }
      }
    });
  hookProvider.setup("storeDetail", { authenticated: true, anonymous: "login" });
})

.name;

export default storeDetailModule;
