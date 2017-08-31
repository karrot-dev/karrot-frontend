import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import pickupFeedbackComponent from "./pickupFeedback.component";
import ScreenSizeModule from "services/screenSize/screenSize";
import FeedbackModule from "services/feedback/feedback";
import UserModule from "services/user/user";

let pickupFeedbackModule = angular.module("pickupFeedback", [
  uiRouter,
  ngMaterial,
  ScreenSizeModule,
  FeedbackModule,
  UserModule
])

.component("pickupFeedback", pickupFeedbackComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("group.pickupFeedback", {
      url: "/give-feedback/{pickupId:int}",
      component: "pickupFeedback",
      ncyBreadcrumb: {
        label: "{{'PICKUP_FEEDBACK.TITLE' | translate}}"
      }
    });
})

.name;

export default pickupFeedbackModule;
