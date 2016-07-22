import AuthenticationService from './authentication.service';

let authenticationModule = angular.module('Authentication', [])

.service('Authentication', AuthenticationService)

.name;

export default authenticationModule;
