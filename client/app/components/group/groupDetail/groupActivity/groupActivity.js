import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupActivityComponent from "./groupActivity.component";
import activityService from "services/activity/activity";
import activity from "../../_activity/activity";

let groupActivityModule = angular.module("groupActivity", [
  uiRouter,
  activity,
  activityService
])

.component("groupActivity", groupActivityComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.activity", {
      url: "/activity",
      component: "groupActivity",
      resolve: {
        groupActivity: (ActivityService, $stateParams, $state) => {
          return ActivityService.list({ group: $stateParams.groupId })
            .catch(() => $state.go("login"));
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.ACTIVITY' | translate}}"
      }
    });
})

.name;

export default groupActivityModule;
