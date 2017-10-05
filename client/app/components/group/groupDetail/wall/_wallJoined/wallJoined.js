import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import wallJoinedComponent from "./wallJoined.component";

let wallJoinedModule = angular.module("wallJoined", [
  uiRouter
])

.component("wallJoined", wallJoinedComponent)

.name;

export default wallJoinedModule;
