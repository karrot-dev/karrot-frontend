import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import AppMaterial from './app.material';
import 'normalize.css';
import '../../node_modules/angular-material/angular-material.css';

angular.module('app', [
    uiRouter,
    ngMaterial,
    Common,
    Components
]).config(($stateProvider, $locationProvider, $urlRouterProvider) => {
  "ngInject";
  $locationProvider.html5Mode(false).hashPrefix('!');
  $stateProvider
    .state('app', {
      abstract: true,
      url: '/'
    });
    $urlRouterProvider.otherwise('/login');
})
.config(AppMaterial)
.component('app', AppComponent);
