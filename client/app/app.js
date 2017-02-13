// modules
import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import ngCookies from "angular-cookies";
import ngAnimate from "angular-animate";
import translate from "angular-translate";
import translateStorageCookie from "angular-translate-storage-cookie";
import "angular-breadcrumb";
import angularLoadingBar from "angular-loading-bar";
import "angular-xeditable";

// config
import Common from "./common/common";
import PageComponents from "./components/pages";
import AppMaterial from "./app.material";
import AppTranslate from "./app.translate";
import AppXEditableConfig from "./app.xeditable";

// styles
import "angular-xeditable/dist/css/xeditable.css";
import "angular-loading-bar/build/loading-bar.css";
import "normalize.css";
import "angular-material/angular-material.css";
import "./fonts/fonts";
import "./app.styl";

import breadcrumbTemplate from "./templates/breadcrumbs.html";

import mainLayout from "./layouts/main.html";
import splashLayout from "./layouts/splash.html";
import logo from "./components/_logo/logo";

angular.module("app", [
  uiRouter,
  ngMaterial,
  "xeditable",
  "ncy-angular-breadcrumb",
  angularLoadingBar,
  ngAnimate,
  ngCookies,
  translate,
  translateStorageCookie,
  Common,
  PageComponents,
  logo
]).config(($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) => {
  "ngInject";
  $locationProvider.html5Mode(false).hashPrefix("!");
  $stateProvider
    .state("main", {
      abstract: true,
      url: "",
      template: mainLayout
    })
    .state("splash", {
      abstract: true,
      url: "",
      template: splashLayout
    });
  $urlRouterProvider.otherwise("/login");
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
})
.config(AppTranslate)
.config(AppMaterial)
.config((cfpLoadingBarProvider) => {
  "ngInject";
  cfpLoadingBarProvider.includeSpinner = false;
})
.run(AppXEditableConfig)
.config(($breadcrumbProvider) => {
  "ngInject";
  $breadcrumbProvider.setOptions({
    template: breadcrumbTemplate
  });
});
