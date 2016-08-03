import angular from 'angular';
import login from './login/login';
import home from './home/home';
import signup from './signup/signup';

let componentModule = angular.module('app.components', [
  login,
  home,
  signup
])

.name;

export default componentModule;
