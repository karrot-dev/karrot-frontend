import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupComponent from "./group.component";
import AuthenticationModule from "services/authentication/authentication";
import groupModule from "services/group/group";
import storeModule from "services/store/store";
import store from "./store/storeDetail";
import storeList from "./_storeList/storeList";
import groupDetail from "./groupDetail/groupDetail";
import groupEdit from "./groupEdit/groupEdit";
import groupInvites from "./groupInvites/groupInvites";
import createGroup from "./createGroup/createGroup";
import searchBar from "./_searchBar/searchBar";
import pickupFeedback from "./pickupFeedback/pickupFeedback";
import groupMap from "./_groupMap/groupMap";
import beMemberOrRedirect from "./group.beMemberOrRedirect";

let groupPageModule = angular.module("group", [
  uiRouter,
  AuthenticationModule,
  ngMaterial,
  groupModule,
  store,
  groupDetail,
  groupEdit,
  groupInvites,
  createGroup,
  storeList,
  storeModule,
  searchBar,
  pickupFeedback,
  groupMap
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group", {
      parent: "main",
      url: "/group/{groupId:int}",
      redirectTo: "group.groupDetail.pickups",
      component: "group",
      resolve: {
        beMemberOrRedirect,
        groupData: (CurrentGroup) => {
          "ngInject";
          return CurrentGroup.value;
        }
      },
      ncyBreadcrumb: {
        label: "{{$ctrl.CurrentGroup.value.name}}"
      }
    });
})

.component("group", groupComponent)

.name;

export default groupPageModule;
