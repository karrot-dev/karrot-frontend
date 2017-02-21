import angular from "angular";
import uiRouter from "angular-ui-router";
import profilePictureComponent from "./profilePicture.component";

let profilePictureModule = angular.module("profilePicture", [
  uiRouter
])

.component("profilePicture", profilePictureComponent)

.name;

export default profilePictureModule;
