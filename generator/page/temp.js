import angular from "angular";
import uiRouter from "angular-ui-router";
import <%= name %>Component from "./<%= name %>.component";

let <%= name %>Module = angular.module("<%= name %>", [
  uiRouter
])

.component("<%= name %>", <%= name %>Component)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("<%= name %>", {
      url: "/<%= name %>",
      component: "<%= name %>"
    });
  hookProvider.setup("<%= name %>", { authenticated: true, anonymous: "login" });
})

.name;

export default <%= name %>Module;
