import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loginComponent from './login.component';
import loginHook from './login.hook';

let loginModule = angular.module('login', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $stateProvider.state('login', {
    url: '/login',
    component: 'login'
  });
  $urlRouterProvider.otherwise('/login');
})

.run(loginHook)

.component('login', loginComponent)

.name;

export default loginModule;
