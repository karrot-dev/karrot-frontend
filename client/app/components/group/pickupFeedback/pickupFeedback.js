import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import Authentication from "services/authentication/authentication";
import pickupFeedbackComponent from "./pickupFeedback.component";

let pickupFeedbackModule = angular.module("pickupFeedback", [
  uiRouter,
  Authentication,
  ngMaterial
])

.component("pickupFeedback", pickupFeedbackComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("group.pickupFeedback", {
      url: "/pickup-feedback",
      component: "pickupFeedback",
      ncyBreadcrumb: {
        label: "{{'PICKUP_FEEDBACK.TITLE' | translate}}"
      }
    });
  hookProvider.setup("pickupFeedback", { authenticated: true, anonymous: "login" });
})

.name;

export default pickupFeedbackModule;
