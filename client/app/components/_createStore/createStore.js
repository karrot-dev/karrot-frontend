import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import createStoreComponent from "./createStore.component";
import Store from "../../common/store/store";

let createStoreModule = angular.module("createStore", [
  uiRouter,
  ngMaterial,
  Store
])

.component("createStore", createStoreComponent)

.name;

export default createStoreModule;
