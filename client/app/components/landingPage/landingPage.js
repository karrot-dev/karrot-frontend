import angular from "angular";
import uiRouter from "angular-ui-router";
import landingPageComponent from "./landingPage.component";
import landingPageMap from "./_landingPageMap/landingPageMap";

let landingPageModule = angular.module("landingPage", [
  uiRouter,
  landingPageMap
])

.component("landingPage", landingPageComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("landingPage", {
      url: "/landingPage",
      component: "landingPage",
      ncyBreadcrumb: {
        label: "Foodsaving Worldwide"
      }
    });
})

.name;

export default landingPageModule;
