import angular from "angular";
import uiRouter from "angular-ui-router";
import ngSanitize from "angular-sanitize";
import groupDetailComponent from "./groupDetail.component";
import AuthenticationModule from "../../common/authentication/authentication";
import groupModule from "../../common/group/group";
import storeList from "../_storeList/storeList";
import userList from "../_userList/userList";
import pickupList from "../_pickupList/pickupList";
import marked from "angular-marked";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter,
  ngSanitize,
  marked,
  AuthenticationModule,
  groupModule,
  storeList,
  userList,
  pickupList
])

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail", {
      parent: "main",
      url: "/group/{groupId:int}",
      component: "groupDetail",
      resolve: {
        groupData: (Group, CurrentGroup, $stateParams) => {
          return Group.get($stateParams.groupId).then((group) => {
            CurrentGroup.set(group);
            return group;
          });
        }
      }
    });
  hookProvider.setup("groupDetail", { authenticated: true, anonymous: "login" });
})

.config((markedProvider) => {
  "ngInject";
  markedProvider.setRenderer({
    link: (href, title, text) => {
      let _title = title ? "title=" + title : "";
      return `<a href='${href}' ${_title} target='_blank'>${text}</a>`;
    }
  });
})

.component("groupDetail", groupDetailComponent)

.name;

export default groupDetailModule;
