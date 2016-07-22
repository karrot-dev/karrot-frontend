import angular from 'angular';
import Authentication from './authentication/authentication';

let commonModule = angular.module('app.common', [
  Authentication
])

.name;

export default commonModule;
