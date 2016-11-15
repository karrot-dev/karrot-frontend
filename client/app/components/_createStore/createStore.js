import angular from "angular";
import uiRouter from "angular-ui-router";
import createStoreComponent from "./createStore.component";

let createStoreModule = angular.module("createStore", [
  uiRouter
])

.component("createStore", createStoreComponent)

.name;

export default createStoreModule;
