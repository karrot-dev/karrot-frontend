import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import GroupService from "services/group/group";
import groupListComponent from "./groupList.component";

let groupListModule = angular.module("groupList", [
  uiRouter,
  GroupService
])

.component("groupList", groupListComponent)

.name;

export default groupListModule;
