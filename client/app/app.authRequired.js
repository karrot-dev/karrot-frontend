let AuthRequiredConfig = ($transitionsProvider) => {
  "ngInject";
  $transitionsProvider.onStart({ to: (state) => {
    return state.data && state.data.authRequired === true;
  } }, (trans) => {
    let $state = trans.router.stateService;
    let Authentication = trans.injector().get("Authentication");
    return Authentication.update().catch(() => {
      return $state.target("login");
    });
  });
};

export default AuthRequiredConfig;
