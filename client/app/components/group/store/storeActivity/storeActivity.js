import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import activityService from "services/activity/activity";
import activity from "../../_activity/activity";
import storeActivityComponent from "./storeActivity.component";

let storeActivityModule = angular.module("storeActivity", [
  uiRouter,
  activityService,
  activity
])

.component("storeActivity", storeActivityComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("storeActivity", {
      parent: "group.store.storeDetail",
      url: "/activity",
      component: "storeActivity",
      resolve: {
        storeActivity: (ActivityService, $stateParams, $state) => {
          return ActivityService.list({ store: $stateParams.storeId })
            .catch(() => $state.go("login"));
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.ACTIVITY' | translate}}"
      }
    });
})

.name;

export default storeActivityModule;
