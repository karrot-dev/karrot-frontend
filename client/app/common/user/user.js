import UserCommunication from './user.service';
import User from './user.wrapper';

let userModule = angular.module('User', [])

.service('UserCommunication', UserCommunication)

.service('User', User)

.name;

export default userModule;
