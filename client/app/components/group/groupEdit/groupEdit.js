import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import groupEditComponent from "./groupEdit.component";
import GroupService from "services/group/group";
import groupEditCreateForm from "../_groupEditCreateForm/groupEditCreateForm";

let groupEditModule = angular.module("groupEdit", [
  uiRouter,
  GroupService,
  groupEditCreateForm
])

.component("groupEdit", groupEditComponent)

.config(($stateProvider) => {
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
})

.name;

export default groupEditModule;
