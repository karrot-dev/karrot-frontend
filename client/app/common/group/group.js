import Group from "./group.service";
import CurrentGroup from "./currentGroup.service";
import Authentication from "../authentication/authentication";

let groupModule = angular.module("Group", [
  Authentication
])

.service("Group", Group)

.service("CurrentGroup", CurrentGroup)

.name;

export default groupModule;
