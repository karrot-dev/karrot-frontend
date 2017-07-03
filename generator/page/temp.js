import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Authentication from "../../services/authentication/authentication";
import <%= name %>Component from "./<%= name %>.component";

let <%= name %>Module = angular.module("<%= name %>", [
  uiRouter,
  Authentication
])

.component("<%= name %>", <%= name %>Component)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("<%= name %>", {
      url: "/<%= name %>",
      component: "<%= name %>",
      data: {
        authRequired: true
      },
    });
})

.name;

export default <%= name %>Module;
