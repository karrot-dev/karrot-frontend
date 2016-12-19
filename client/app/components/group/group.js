import angular from "angular";
import uiRouter from "angular-ui-router";
import groupComponent from "./group.component";
import AuthenticationModule from "../../common/authentication/authentication";
import groupModule from "../../common/group/group";
import storeList from "../_storeList/storeList";
import userList from "../_userList/userList";
import pickupList from "../_pickupList/pickupList";
import expandablePanel from "../_expandablePanel/expandablePanel";
import store from "./store/storeDetail";
import groupDetail from "./groupDetail/groupDetail";

let groupPageModule = angular.module("group", [
  uiRouter,
  AuthenticationModule,
  groupModule,
  storeList,
  userList,
  pickupList,
  expandablePanel,
  store,
  groupDetail
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("group", {
      parent: "main",
      url: "/group/{groupId:int}",
      component: "group",
      resolve: {
        groupData: ($state, Group, CurrentGroup, $stateParams) => {
          return Group.get($stateParams.groupId).then((group) => {
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
