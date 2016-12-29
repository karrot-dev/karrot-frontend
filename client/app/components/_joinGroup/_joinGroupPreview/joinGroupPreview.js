import angular from "angular";
import uiRouter from "angular-ui-router";
import joinGroupPreviewComponent from "./joinGroupPreview.component";

let joinGroupPreviewModule = angular.module("joinGroupPreview", [
  uiRouter
])

.component("joinGroupPreview", joinGroupPreviewComponent)

.name;

export default joinGroupPreviewModule;
