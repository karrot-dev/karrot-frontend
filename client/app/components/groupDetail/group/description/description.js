import angular from "angular";
import uiRouter from "angular-ui-router";
import descriptionComponent from "./description.component";

let descriptionModule = angular.module("description", [
  uiRouter
])

.component("description", descriptionComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail.group.description", {
      url: "/description",
      views: {
        "detail@groupDetail.group": {
          component: "description"
        }
      }
    });
})

.name;

export default descriptionModule;
