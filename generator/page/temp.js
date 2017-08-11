import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import <%= name %>Component from "./<%= name %>.component";

let <%= name %>Module = angular.module("<%= name %>", [
  uiRouter,
])

.component("<%= name %>", <%= name %>Component)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("<%= name %>", {
      url: "/<%= name %>",
      component: "<%= name %>"
    });
})

.name;

export default <%= name %>Module;
