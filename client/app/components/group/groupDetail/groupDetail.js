import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupDetailComponent from "./groupDetail.component";
import groupOptions from "./_groupOptions/groupOptions";
import groupModule from "services/group/group";
import description from "./description/description";
import members from "./members/members";
import pickups from "./pickups/pickups";
import groupActivity from "./groupActivity/groupActivity";
import expandablePanel from "components/_expandablePanel/expandablePanel";
import ScreenSizeModule from "services/screenSize/screenSize";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter,
  ngMaterial,
  groupOptions,
  groupModule,
  description,
  members,
  pickups,
  groupActivity,
  groupHistory,
  expandablePanel,
  ScreenSizeModule
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
