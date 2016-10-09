import AuthCommunication from "./authentication.service";
import Authentication from "./authentication.wrapper";
import uiRouter from "angular-ui-router";

let authenticationModule = angular.module("Authentication", [
  uiRouter
])

.service("AuthCommunication", AuthCommunication)

.service("Authentication", Authentication)

.name;

export default authenticationModule;
