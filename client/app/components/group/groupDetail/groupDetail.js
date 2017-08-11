import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import groupDetailComponent from "./groupDetail.component";
import groupOptions from "./_groupOptions/groupOptions";
import groupModule from "services/group/group";
import description from "./description/description";
import chat from "./chat/chat";
import members from "./members/members";
import pickups from "./pickups/pickups";
import groupHistory from "./groupHistory/groupHistory";
import expandablePanel from "components/_expandablePanel/expandablePanel";

let groupDetailModule = angular.module("groupDetail", [
  uiRouter,
  ngMaterial,
  groupOptions,
  groupModule,
  description,
  chat,
  members,
  pickups,
  groupHistory,
  expandablePanel
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
