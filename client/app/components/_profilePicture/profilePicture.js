import angular from "angular";
import uiRouter from "angular-ui-router";
import profilePictureComponent from "./profilePicture.component";
import userService from "../../services/user/user";

let profilePictureModule = angular.module("profilePicture", [
  uiRouter,
  userService
])

.component("profilePicture", profilePictureComponent)

.name;

export default profilePictureModule;
