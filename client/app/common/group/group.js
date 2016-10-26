import Group from "./group.service";
import Authentication from "../authentication/authentication";

let groupModule = angular.module("Group", [
  Authentication
])

.service("Group", Group)

.name;

export default groupModule;
