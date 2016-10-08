import Authentication from "./authentication.service";

let authenticationModule = angular.module("Authentication", [])

.service("Authentication", Authentication)

.name;

export default authenticationModule;
