import User from './user.service';

let userModule = angular.module('User', [])

.service('User', User)

.name;

export default userModule;
