import angular from 'angular';
import Authentication from './authentication/authentication';
import Group from './group/group';
import Store from './store/store';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Authentication,
  Group,
  Store,
  User
])

.name;

export default commonModule;
