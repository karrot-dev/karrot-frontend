import angular from 'angular';
import uiRouter from 'angular-ui-router';
import groupsComponent from './groups.component';

let groupsModule = angular.module('groups', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state('groups', {
        url: "/group/:id",
        component: 'groups',
        resolve: {
          groupdata: (Group, $stateParams) => {
            return Group.get({"id": $stateParams.id});
          }
        }
    });
})

.component('groups', groupsComponent)

.name;

export default groupsModule;
