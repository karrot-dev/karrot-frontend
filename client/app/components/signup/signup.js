import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import signupComponent from "./signup.component";
import Authentication from "services/authentication/authentication";
import User from "services/user/user";
import Invitation from "services/invitation/invitation";

let signupModule = angular.module("signup", [
  uiRouter,
  Authentication,
  User,
  Invitation
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider.state("signup", {
    parent: "splash",
    url: "/signup?invite&email",
    component: "signup",
    redirectTo: (trans) => {
      let SessionUser = trans.injector().get("SessionUser");
      let $stateParams = trans.injector().get("$stateParams");
      let Invitation = trans.injector().get("Invitation");
      return SessionUser.loaded
      .then(() => {
        if ($stateParams.invite) {
          return Invitation.accept($stateParams.invite)
          .then(() => "home");
        }
        return "home";
      })
      .catch(() => {
        return;
      });
    },
    ncyBreadcrumb: {
      label: "{{ 'SIGNUP.TITLE' | translate}}"
    }
  });
})

.component("signup", signupComponent)

.name;

export default signupModule;
