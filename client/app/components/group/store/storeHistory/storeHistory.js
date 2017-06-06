import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Authentication from "../../../../services/authentication/authentication";
import historyService from "../../../../services/history/history";
import history from "../../_history/history";
import storeHistoryComponent from "./storeHistory.component";

let storeHistoryModule = angular.module("storeHistory", [
  uiRouter,
  Authentication,
  historyService,
  history
])

.component("storeHistory", storeHistoryComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("storeHistory", {
      parent: "group.store.storeDetail",
      url: "/history",
      component: "storeHistory",
      resolve: {
        storeHistory: (HistoryService, $stateParams) => {
          return HistoryService.list({ store: $stateParams.storeId });
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.HISTORY' | translate}}"
      }
    });
  hookProvider.setup("storeHistory", { authenticated: true, anonymous: "login" });
})

.name;

export default storeHistoryModule;
