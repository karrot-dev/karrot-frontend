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
      redirectTo: (trans) => {
        let GroupService = trans.injector().get("GroupService");
        let CurrentGroup = trans.injector().get("CurrentGroup");
        let $stateParams = trans.injector().get("$stateParams");
        let SessionUser = trans.injector().get("SessionUser");
        let $translate = trans.injector().get("$translate");
        let $mdToast = trans.injector().get("$mdToast");
        let $state = trans.injector().get("$state");
        return GroupService.get($stateParams.groupId)
          .then((group) => {
            if (group.members.indexOf(SessionUser.value.id) >= 0) {
              CurrentGroup.set(group);
              return "group.groupDetail.pickups";
            } else {
              $translate("GROUP.NONMEMBER_REDIRECT").then((message) => {
                $mdToast.showSimple(message);
              });
              // re-uses same groupId state parameter
              return "groupInfo";
            }
          })
          .catch(() => {
            $state.go("notFound");
          });
      },
      component: "group",
      resolve: {
        groupData: (CurrentGroup, GroupService, $stateParams) => {
          if (CurrentGroup.value.id !== $stateParams.groupId) {
            return GroupService.get($stateParams.groupId).then((group) => CurrentGroup.set(group));
          }
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
