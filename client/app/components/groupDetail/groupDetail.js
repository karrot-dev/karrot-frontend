import angular from "angular";
import uiRouter from "angular-ui-router";
import groupDetailComponent from "./groupDetail.component";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail", {
      url: "/group/:id",
      component: "groupDetail",
      resolve: {
        groupdata: (Group, $stateParams) => {
          return Group.get({ "id": $stateParams.id });
        },
        stores: (Store, $stateParams) => {
          return Store.get({ "group": $stateParams.id });
        }
      }
    });
  hookProvider.setup("groupDetail", { authenticated: true, anonymous: "login" });
})

.component("groupDetail", groupDetailComponent)

.name;

export default groupDetailModule;
