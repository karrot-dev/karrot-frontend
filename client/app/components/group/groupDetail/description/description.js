import angular from "angular";
import uiRouter from "angular-ui-router";
import expandablePanel from "../../../_expandablePanel/expandablePanel";
import descriptionComponent from "./description.component";

let descriptionModule = angular.module("description", [
  uiRouter,
  expandablePanel
])

.component("description", descriptionComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.description", {
      url: "/description",
      views: {
        "detail@group.groupDetail": {
          component: "description"
        }
      },
      ncyBreadcrumb: {
        label: "{{'GROUP.DESCRIPTION' | translate}}"
      }
    });
})

.name;

export default descriptionModule;
