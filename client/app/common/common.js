import angular from 'angular';
import Authentication from './authentication/authentication';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Authentication,
  User
])

.name;

export default commonModule;
