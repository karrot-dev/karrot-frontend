/* 
Pass a data object containing "authCheck" to the $stateProvider. 
This will check if the user is signed in, and if not, redirect to the "login" page

authCheck: true

or reference the authCheck configuration of another state:

authCheck: "anotherState"


Alternatively, define a custom callback function to do something if the user is not logged in:

authCheck: {
  failure: ($state) => $state.target("signup")
}

You can also do something if the user *is* logged in:

authCheck: {
  success: ($state) => $state.target("home")
}

The callback function gets those parameters:
  1. $state: a UI-Router stateService, useful for returning a new target state
  2. trans: a transition class instance, useful for getting trans.injector()
  3. response: the response from the back-end authentication endpoint

The return value gets passed back to the onStart hook to cancel, redirect or resume the transition:
https://ui-router.github.io/ng1/docs/latest/modules/transition.html#hookresult

*/

export function redirectToLogin($state, trans, response) {
  console.log("redirect to login");
  if (response.status === 401) {
    let $translate = trans.injector().get("$translate");
    let $mdToast = trans.injector().get("$mdToast");
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    return $state.target("login");
  }
}

export function AuthCheckConfig($transitionsProvider) {
  "ngInject";
  $transitionsProvider.onBefore({ to: (state) => {
    console.log("check test to", angular.copy(state));
    return Boolean(state.authCheck);
  } }, (trans) => {
    let $state = trans.router.stateService;
    let config = trans.to().authCheck;

    // define default reaction and override if customized
    let reactions = {
      failure: redirectToLogin
    };
    if (angular.isObject(config)) {
      console.log("custom config");
      reactions = angular.copy(config);
    }
    if (angular.isString(config)) {
      // inherit authCheck config from given state
      console.log("inheriting config");
      reactions = $state.get(config).authCheck;
    }
    console.log("reactions", reactions);

    // get auth status
    let Authentication = trans.injector().get("Authentication");
    let authPromise = Authentication.update(true);

    // assign reactions as promise handlers
    if (angular.isDefined(reactions.success)) {
      authPromise = authPromise.then((response) => reactions.success($state, trans, response));
    }
    if (angular.isDefined(reactions.failure)) {
      console.log("assign failure handler");
      authPromise = authPromise.catch((response) => reactions.failure($state, trans, response));
    }

    return authPromise;
  });
}