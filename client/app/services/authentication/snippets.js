export function loggedInOrRedirectToLogin (Authentication, $state, $translate, $mdToast, $q) {
  "ngInject";
  return Authentication.update()
  .catch(() => {
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    return $q.reject($state.go("login"));
  });
}

export function loggedOutOrRedirectToHome (Authentication, $state, $q) {
  "ngInject";
  return Authentication.update()
  .then(() => $q.reject($state.go("home")))
  .catch(() => $q.resolve());
}