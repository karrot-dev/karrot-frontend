import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import ngCookies from "angular-cookies";
import translate from "angular-translate";
import translateStorageCookie from "angular-translate-storage-cookie";
import "angular-breadcrumb";
import Common from "./common/common";
import PageComponents from "./components/pages";
import AppMaterial from "./app.material";
import AppTranslate from "./app.translate";
import AppXEditableConfig from "./app.xeditable";
import "angular-xeditable";
import "../../node_modules/angular-xeditable/dist/css/xeditable.css";
import "normalize.css";
import "../../node_modules/angular-material/angular-material.css";
import "./fonts/fonts";
import "./app.styl";

import mainLayout from "./layouts/main.html";
import splashLayout from "./layouts/splash.html";

angular.module("app", [
  uiRouter,
  ngMaterial,
  "xeditable",
  "ncy-angular-breadcrumb",
  ngCookies,
  translate,
  translateStorageCookie,
  Common,
  PageComponents
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
.run(AppXEditableConfig)
.run(["$rootScope", "$breadcrumb", "$document", ($rootScope, $breadcrumb, $document) => {
  $rootScope.setPageTitle = () => {
    let pageTitleString = "";
    let breadcrumbs = $breadcrumb.getStatesChain();
    angular.forEach(breadcrumbs, (crumb) => {
      pageTitleString = crumb.ncyBreadcrumbLabel + " · " + pageTitleString;
    });
    pageTitleString += "Foodsaving";
    $document[0].title = pageTitleString;
  };

  $rootScope.$watch(() => { // eslint-disable-line
    return $document[0].URL;
  }, $rootScope.setPageTitle);
}]);
