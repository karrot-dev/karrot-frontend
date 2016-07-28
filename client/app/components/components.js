import angular from 'angular';
import login from './login/login';
import home from './home/home';

let componentModule = angular.module('app.components', [
  login, home
])

.name;

export default componentModule;
