import angular from "angular";
import uiRouter from "angular-ui-router";
import groupDetailComponent from "./groupDetail.component";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state("groupDetail", {
      url: "/group/:id",
      component: "groups",
      resolve: {
        groupdata: (Group, $stateParams) => {
          return Group.get({ "id": $stateParams.id });
        }
      }
    });
})

.component("groupDetail", groupDetailComponent)

.name;

export default groupDetailModule;
