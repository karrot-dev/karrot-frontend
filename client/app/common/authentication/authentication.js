import AuthCommunication from './authentication.service';
import Authentication from './authentication.wrapper';

let authenticationModule = angular.module('Authentication', [])

.service('AuthCommunication', AuthCommunication)

.service('Authentication', Authentication)

.name;

export default authenticationModule;
