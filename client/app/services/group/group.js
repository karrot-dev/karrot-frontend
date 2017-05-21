import GroupService from "./groupService.service";
import CurrentGroup from "./currentGroup.service";
import Authentication from "../authentication/authentication";
import User from "../user/user";

let groupServiceModule = angular.module("GroupService", [
  Authentication,
  User
])

.service("GroupService", GroupService)

.service("CurrentGroup", CurrentGroup)

.name;

export default groupServiceModule;
