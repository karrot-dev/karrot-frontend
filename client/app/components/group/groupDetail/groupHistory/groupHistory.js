import angular from "angular";
import uiRouter from "@uirouter/angularjs";
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
        groupHistory: (HistoryService, $stateParams) => {
          return HistoryService.list({ group: $stateParams.groupId });
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.HISTORY' | translate}}"
      }
    });
})

.name;

export default groupHistoryModule;
