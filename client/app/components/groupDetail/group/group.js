import angular from "angular";
import uiRouter from "angular-ui-router";
import groupComponent from "./group.component";
import description from "./description/description";
import members from "./members/members";
import pickups from "./pickups/pickups";
import stores from "./stores/stores";

let groupModule = angular.module("group", [
  uiRouter,
  description,
  members,
  pickups,
  stores
])

.component("group", groupComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";

  $stateProvider
    .state("groupDetail.group", {
      url: "",
      views: {
        "mainView@groupDetail": {
          component: "group"
        }
      }
    });
    
    
  $stateProvider
    .state("group", {
      url: "/group",
      component: "group"
    });
})

.name;

export default groupModule;
