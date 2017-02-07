import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import groupComponent from "./group.component";
import AuthenticationModule from "../../common/authentication/authentication";
import groupModule from "../../common/group/group";
import store from "./store/storeDetail";
import groupDetail from "./groupDetail/groupDetail";

let groupPageModule = angular.module("group", [
  uiRouter,
  AuthenticationModule,
  ngMaterial,
  groupModule,
  store,
  groupDetail
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("group", {
      parent: "main",
      url: "/group/{groupId:int}",
      redirectTo: "group.groupDetail.pickups",
      component: "group",
      resolve: {
        groupData: ($state, GroupService, CurrentGroup, $stateParams) => {
          return GroupService.get($stateParams.groupId).then((group) => {
            CurrentGroup.set(group);
            $state.groupData = group;
            return group;
          });
        }
      },
      ncyBreadcrumb: {
        label: "{{$ctrl.groupData.name}}"
      }
    });
  hookProvider.setup("group", { authenticated: true, anonymous: "login" });
})

.component("group", groupComponent)

.name;

export default groupPageModule;
