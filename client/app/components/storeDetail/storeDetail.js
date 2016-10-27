import angular from "angular";
import uiRouter from "angular-ui-router";
import storeDetailComponent from "./storeDetail.component";

import AuthenticationModule from "../../common/authentication/authentication";
import storeModule from "../../common/store/store";
import groupModule from "../../common/group/group";

let storeDetailModule = angular.module("storeDetail", [
  uiRouter,
  AuthenticationModule,
  storeModule,
  groupModule
])

.component("storeDetail", storeDetailComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("storeDetail", {
      parent: "main",
      url: "/store/:id",
      component: "storeDetail",
      resolve: {

        storedata: (Store, $stateParams) => {
          return Store.get($stateParams.id);
        },

        /**
          Loads the group for this store, and sets it as the current group
        */
        groupdata: (storedata, Group, CurrentGroup) => {
          "ngInject";
          return Group.get(storedata.group).then((group) => {
            CurrentGroup.set(group);
            return group;
          });
        }

      }
    });
  hookProvider.setup("storeDetail", { authenticated: true, anonymous: "login" });
})

.name;

export default storeDetailModule;
