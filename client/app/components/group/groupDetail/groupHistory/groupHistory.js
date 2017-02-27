import angular from "angular";
import uiRouter from "angular-ui-router";
import groupHistoryComponent from "./groupHistory.component";
import history from "../../_history/history";

let groupHistoryModule = angular.module("groupHistory", [
  uiRouter,
  history
])

.component("groupHistory", groupHistoryComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.history", {
      url: "/history",
      component: "history",
      ncyBreadcrumb: {
        label: "{{'GROUP.HISTORY' | translate}}"
      }
    });
})

.name;

export default groupHistoryModule;
