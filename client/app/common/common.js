import angular from 'angular';
import Authentication from './authentication/authentication';
import Group from './group/group';
import PickupDate from './pickupDate/pickupDate';
import Store from './store/store';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Authentication,
  Group,
  PickupDate,
  Store,
  User
])

.name;

export default commonModule;
