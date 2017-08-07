export function loggedInOrRedirectToLogin (SessionUser, $state, $translate, $mdToast, $q) {
  "ngInject";
  return SessionUser.loaded
  .catch(() => {
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    return $q.reject($state.go("login"));
  });
}

export function loggedOutOrRedirectToHome (SessionUser, $state, $q) {
  "ngInject";
  return SessionUser.loaded
  .then(() => $q.reject($state.go("home")))
  .catch(() => $q.resolve());
}