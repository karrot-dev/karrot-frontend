import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import homeHook from './home.hook';

let homeModule = angular.module('home', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    });
})

.run(homeHook)

.component('home', homeComponent)

.name;

export default homeModule;
