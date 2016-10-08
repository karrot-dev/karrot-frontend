import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import Common from "./common/common";
import Components from "./components/components";
import AppComponent from "./app.component";
import AppMaterial from "./app.material";
import "normalize.css";
import "../../node_modules/angular-material/angular-material.css";
import "./fonts/fonts";

angular.module("app", [
  uiRouter,
  ngMaterial,
  Common,
  Components
]).config(($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) => {
  "ngInject";
  $locationProvider.html5Mode(false).hashPrefix("!");
  $stateProvider
    .state("app", {
      abstract: true,
      url: "/"
    });
  $urlRouterProvider.otherwise("/login");
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
})
.config(AppMaterial)
.component("app", AppComponent);
