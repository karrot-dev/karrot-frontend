import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import expandablePanel from "../../../_expandablePanel/expandablePanel";
import GroupService from "../../../../services/group/group";
import descriptionComponent from "./description.component";

let descriptionModule = angular.module("description", [
  uiRouter,
  ngMaterial,
  GroupService,
  expandablePanel
])

.component("description", descriptionComponent)

.config(($stateProvider, $mdMediaProvider) => {
  "ngInject";
  $stateProvider
    .state("group.groupDetail.description", {
      url: "/description",
      redirectTo: () => {
        if ($mdMediaProvider.$get()("gt-sm")) {
          return "group";
        }
      },
      component: "description",
      ncyBreadcrumb: {
        label: "{{'GROUP.DESCRIPTION' | translate}}"
      }
    });
})

.name;

export default descriptionModule;
