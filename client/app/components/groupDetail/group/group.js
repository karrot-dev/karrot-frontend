import angular from "angular";
import uiRouter from "angular-ui-router";
import groupComponent from "./group.component";
import description from "./description/description";
import members from "./members/members";
import pickups from "./pickups/pickups";
import stores from "./stores/stores";
import groupModule from "../../../common/group/group";

let groupComponentModule = angular.module("group", [
  uiRouter,
  description,
  members,
  pickups,
  stores,
  groupModule
])

.component("groupComponent", groupComponent)

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state("groupDetail.group", {
      url: "",
      views: {
        "mainView@groupDetail": {
          component: "groupComponent"
        }
      }
    });
})

.name;

export default groupComponentModule;
