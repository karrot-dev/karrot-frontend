import Authentication from "./authentication.service";
import SessionUser from "./sessionUser.service";
import uiRouter from "@uirouter/angularjs";
import hookProvider from "./hook.js";

let authenticationModule = angular.module("Authentication", [
  uiRouter
])

.provider("hook", hookProvider)

.service("Authentication", Authentication)

.service("SessionUser", SessionUser)

.name;

export default authenticationModule;
