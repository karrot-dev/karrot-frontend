import angular from "angular";
import uiRouter from "angular-ui-router";
import groupDetailComponent from "./groupDetail.component";

import AuthenticationModule from "../../common/authentication/authentication";
import groupModule from "../../common/group/group";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter,
  AuthenticationModule,
  groupModule
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail", {
      parent: "main",
      url: "/group/{id:int}",
      component: "groupDetail",
      resolve: {
        groupdata: (Group, CurrentGroup, $stateParams) => {
          return Group.get($stateParams.id).then((group) => {
            CurrentGroup.set(group);
            return group;
          });
        },
        stores: (Store, $stateParams) => {
          return Store.listByGroupId($stateParams.id);
        }
      }
    });
  hookProvider.setup("groupDetail", { authenticated: true, anonymous: "login" });
})

.component("groupDetail", groupDetailComponent)

.name;

export default groupDetailModule;
