import GroupService from "./groupService.service";
import CurrentGroup from "./currentGroup.service";
import Authentication from "../authentication/authentication";

let groupServiceModule = angular.module("GroupService", [
  Authentication
])

.service("GroupService", GroupService)

.service("CurrentGroup", CurrentGroup)

.name;

export default groupServiceModule;
