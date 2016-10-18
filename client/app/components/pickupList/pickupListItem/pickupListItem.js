import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pickupListItemComponent from './pickupListItem.component';

let pickupListItemModule = angular.module('pickupListItem', [
  uiRouter
])

.component('pickupListItem', pickupListItemComponent)

.name;

export default pickupListItemModule;
