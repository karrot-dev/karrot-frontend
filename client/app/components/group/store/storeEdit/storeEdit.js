import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import storeEditComponent from "./storeEdit.component";
import storeService from "services/store/store";
import storeEditCreateForm from "../_storeEditCreateForm/storeEditCreateForm";

let storeEditModule = angular.module("storeEdit", [
  uiRouter,
  storeService,
  storeEditCreateForm
])

.component("storeEdit", storeEditComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("storeEdit", {
      parent: "group",
      url: "/store/{storeId:int}/edit",
      component: "storeEdit",
      resolve: {
        storedata: (Store, $stateParams, $state) => {
          return Store.get($stateParams.storeId)
            .catch(() => $state.go("login"));
        }
      },
      ncyBreadcrumb: {
        label: "{{'STOREDETAIL.EDIT' | translate}}"
      }
    });
})

.name;

export default storeEditModule;
