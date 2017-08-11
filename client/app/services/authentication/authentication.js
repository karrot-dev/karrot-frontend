import Authentication from "./authentication.service";
import SessionUser from "./sessionUser.service";
import uiRouter from "@uirouter/angularjs";

let authenticationModule = angular.module("Authentication", [
  uiRouter
])

.service("Authentication", Authentication)

.service("SessionUser", SessionUser)

.name;

export default authenticationModule;
