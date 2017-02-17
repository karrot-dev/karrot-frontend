import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import createStoreComponent from "./createStore.component";
import createStoreMap from "./_createStoreMap/createStoreMap";
import Store from "../../services/store/store";
import Geocoding from "../../services/geocoding/geocoding";

let createStoreModule = angular.module("createStore", [
  uiRouter,
  ngMaterial,
  createStoreMap,
  Store,
  Geocoding
])

.component("createStore", createStoreComponent)

.name;

export default createStoreModule;
