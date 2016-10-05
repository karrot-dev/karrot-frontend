import Group from './group.service';

let groupModule = angular.module('Group', [])

.service('Group', Group)

.name;

export default groupModule;
