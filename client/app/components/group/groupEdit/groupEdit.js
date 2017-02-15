import angular from "angular";
import uiRouter from "angular-ui-router";
import Authentication from "../../../common/authentication/authentication";
import groupEditComponent from "./groupEdit.component";
import GroupService from "../../../common/group/group";
import markdownInput from "../../_markdownInput/markdownInput";

let groupEditModule = angular.module("groupEdit", [
  uiRouter,
  Authentication,
  GroupService,
  markdownInput
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
