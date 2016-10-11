import Authentication from "./authentication.service";
import uiRouter from "angular-ui-router";

let authenticationModule = angular.module("Authentication", [
  uiRouter
])

.service("Authentication", Authentication)

.name;

export default authenticationModule;
