import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupComponent from "./group.component";
import AuthenticationModule from "../../services/authentication/authentication";
import groupModule from "../../services/group/group";
import storeModule from "../../services/store/store";
import store from "./store/storeDetail";
import storeList from "./_storeList/storeList";
import groupDetail from "./groupDetail/groupDetail";
import groupEdit from "./groupEdit/groupEdit";
import createGroup from "./createGroup/createGroup";
import searchBar from "./_searchBar/searchBar";

let groupPageModule = angular.module("group", [
  uiRouter,
  AuthenticationModule,
  ngMaterial,
  groupModule,
  store,
  groupDetail,
  groupEdit,
  createGroup,
  storeList,
  storeModule,
  searchBar
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group", {
      parent: "auth",
      url: "/group/{groupId:int}",
      redirectTo: (trans) => {
        let GroupService = trans.injector().get("GroupService");
        let $stateParams = trans.injector().get("$stateParams");
        let Authentication = trans.injector().get("Authentication");
        let $translate = trans.injector().get("$translate");
        let $mdToast = trans.injector().get("$mdToast");
        return GroupService.get($stateParams.groupId).then((group) => {
          if (group.members.indexOf(Authentication.data.id) >= 0) {
            return "group.groupDetail.pickups";
          } else {
            $translate("GROUP.NONMEMBER_REDIRECT").then((message) => {
              $mdToast.showSimple(message);
            });
            // re-uses same groupId state parameter
            return "groupInfo";
          }
        });
      },
      component: "group",
      resolve: {
        groupData: (CurrentGroup) => {
          return CurrentGroup.value;
        },
        groupDataResolve: (GroupService, CurrentGroup, $stateParams) => {
          return GroupService.get($stateParams.groupId).then((group) => {
            CurrentGroup.set(group);
            return group;
          });
        }
      },
      data: {
        authRequired: true
      },
      ncyBreadcrumb: {
        label: "{{$ctrl.groupData.name}}"
      }
    });
})

.component("group", groupComponent)

.name;

export default groupPageModule;
