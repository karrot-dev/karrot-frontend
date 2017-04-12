import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import groupDetailComponent from "./groupDetail.component";
import description from "./description/description";
import members from "./members/members";
import pickups from "./pickups/pickups";
import stores from "./stores/stores";
import activity from "./groupActivity/groupActivity";
import expandablePanel from "../../_expandablePanel/expandablePanel";
import GroupService from "../../../services/group/group";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter,
  ngMaterial,
  description,
  members,
  pickups,
  stores,
  activity,
  expandablePanel,
  GroupService
])

.component("groupDetail", groupDetailComponent)

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state("group.groupDetail", {
      abstract: true,
      component: "groupDetail"
    });
})

.name;

export default groupDetailModule;
