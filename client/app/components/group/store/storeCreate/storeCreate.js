import angular from "angular";
import uiRouter from "angular-ui-router";
import storeService from "../../../../services/store/store";
import storeCreateComponent from "./storeCreate.component";
import storeEditCreateForm from "../_storeEditCreateForm/storeEditCreateForm";

let storeCreateModule = angular.module("storeCreate", [
  uiRouter,
  storeService,
  storeEditCreateForm
])

.component("storeCreate", storeCreateComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.storeCreate", {
      url: "/store/create",
      component: "storeCreate",
      ncyBreadcrumb: {
        label: "{{'CREATESTORE.TITLE' | translate}}"
      }
    });
})

.name;

export default storeCreateModule;
