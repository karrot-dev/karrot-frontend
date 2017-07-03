let AuthRequiredConfig = ($transitionsProvider) => {
  "ngInject";
  $transitionsProvider.onStart({ to: (state) => {
    return state.data && state.data.authRequired === true;
  } }, (trans) => {
    let $state = trans.router.stateService;
    let Authentication = trans.injector().get("Authentication");
    return Authentication.update().catch(() => {
      let $translate = trans.injector().get("$translate");
      let $mdToast = trans.injector().get("$mdToast");
      $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
        $mdToast.showSimple(message);
      });
      return $state.target("login");
    });
  });
};

export default AuthRequiredConfig;
