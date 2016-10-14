import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pickupListComponent from './pickupList.component';

let pickupListModule = angular.module('pickupList', [
  uiRouter
])

.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
