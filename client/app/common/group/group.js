import GroupCom from './group.service';
import Group from './group.wrapper';

let groupModule = angular.module('Group', [])

.service('GroupCommunication', GroupCom)

.service('Group', Group)

.name;

export default groupModule;
