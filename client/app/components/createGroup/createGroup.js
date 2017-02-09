import angular from "angular";
import uiRouter from "angular-ui-router";
import createGroupComponent from "./createGroup.component";
import Group from "../../common/group/group";
import Geocoding from "../../common/geocoding/geocoding";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let createGroupModule = angular.module("createGroup", [
  uiRouter,
  Group,
  Geocoding,
  "ui-leaflet"
])

.component("createGroup", createGroupComponent)

.config(($stateProvider, hookProvider) => {
  "ngInject";
  $stateProvider
    .state("createGroup", {
      parent: "main",
      url: "/group/create",
      component: "createGroup"
    });
  hookProvider.setup("createGroup", { authenticated: true, anonymous: "login" });
})

.name;

export default createGroupModule;
