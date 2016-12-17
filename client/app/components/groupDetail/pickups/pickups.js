import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupsComponent from "./pickups.component";

let pickupsModule = angular.module("pickups", [
  uiRouter
])

.component("pickups", pickupsComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("groupDetail.pickups", {
      url: "/pickups",
      views: {
        "detail@groupDetail": {
          component: "pickups"
        }
      }
    });
  hookProvider.setup("pickups", { authenticated: true, anonymous: "login" });
})

.name;

export default pickupsModule;
