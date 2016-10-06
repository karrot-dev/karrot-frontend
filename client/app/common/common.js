import angular from "angular";
import Authentication from "./authentication/authentication";
import User from "./user/user";
import Group from "./group/group";

let commonModule = angular.module("app.common", [
  Authentication,
  User,
  Group
])

.name;

export default commonModule;
