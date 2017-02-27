import angular from "angular";
import uiRouter from "angular-ui-router";
import groupHistoryComponent from "./groupHistory.component";
import historyService from "../../../../services/history/history";
import history from "../../_history/history";

let groupHistoryModule = angular.module("groupHistory", [
  uiRouter,
  history,
  historyService
])

.component("groupHistory", groupHistoryComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.history", {
      url: "/history",
      component: "groupHistory",
      resolve: {
        groupHistory: (History) => {
          return History.get();
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.HISTORY' | translate}}"
      }
    });
})

.name;

export default groupHistoryModule;
