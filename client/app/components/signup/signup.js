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
      let Authentication = trans.injector().get("Authentication");
      let $stateParams = trans.injector().get("$stateParams");
      let Invitation = trans.injector().get("Invitation");
      return Authentication.update()
      .then(() => {
        if ($stateParams.invite) {
          return Invitation.accept($stateParams.invite)
          .then(() => "home")
          .catch(() => "home");
        }
        return "home";
      })
      .catch(() => {
        console.log("bla");
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
