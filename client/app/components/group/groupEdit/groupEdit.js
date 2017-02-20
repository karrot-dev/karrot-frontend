import angular from "angular";
import uiRouter from "angular-ui-router";
import Authentication from "../../../services/authentication/authentication";
import groupEditComponent from "./groupEdit.component";
import GroupService from "../../../services/group/group";
import groupEditCreateForm from "../_groupEditCreateForm/groupEditCreateForm";

let groupEditModule = angular.module("groupEdit", [
  uiRouter,
  Authentication,
  GroupService,
  groupEditCreateForm
])

.component("groupEdit", groupEditComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("groupEdit", {
      parent: "group",
      url: "/edit",
      component: "groupEdit",
      ncyBreadcrumb: {
        label: "{{'GROUP.EDIT' | translate}}"
      }
    });
  hookProvider.setup("groupEdit", { authenticated: true, anonymous: "login" });
})

.name;

export default groupEditModule;
