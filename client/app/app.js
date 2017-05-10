// modules
import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import ngCookies from "angular-cookies";
import ngAnimate from "angular-animate";
import ngAria from "angular-aria";
import translate from "angular-translate";
import translateStorageCookie from "angular-translate-storage-cookie";
import "angular-breadcrumb";
import angularLoadingBar from "angular-loading-bar";
import ngLocale from "angular-dynamic-locale";
import "angular-promise-buttons";

// config
import Services from "./services/services";
import PageComponents from "./components/pages";
import AppMaterial from "./app.material";
import AppLocalizeConfig from "./app.localizeConfig";
import AppLocalizeRun from "./app.localizeRun";
import AppHTTPErrorHandler from "./app.HTTPErrorHandler";

// styles
import "angular-loading-bar/build/loading-bar.css";
import "normalize.css";
import "angular-material/angular-material.css";
import "./fonts/fonts";
import "./app.styl";

import breadcrumbTemplate from "./templates/breadcrumbs.html";

angular.module("app", [
  ngLocale,
  uiRouter,
  ngMaterial,
  "ncy-angular-breadcrumb",
  "angularPromiseButtons",
  angularLoadingBar,
  ngAnimate,
  ngAria,
  ngCookies,
  translate,
  translateStorageCookie,
  Services,
  PageComponents
]).config(($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) => {
  "ngInject";
  $locationProvider.html5Mode(false).hashPrefix("!");
  $urlRouterProvider.otherwise("/landingPage");
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
})
.config(AppLocalizeConfig)
.run(AppLocalizeRun)
.config(AppMaterial)
.config(AppHTTPErrorHandler)
.config((cfpLoadingBarProvider) => {
  "ngInject";
  cfpLoadingBarProvider.includeSpinner = false;
})
.config(($mdAriaProvider) => {
  "ngInject";
  // Globally disables all ARIA warnings.
  $mdAriaProvider.disableWarnings();
})
.config(($breadcrumbProvider) => {
  "ngInject";
  $breadcrumbProvider.setOptions({
    template: breadcrumbTemplate
  });
});
