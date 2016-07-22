

let appRun = ($rootScope, $state, Authentication) => {
  'ngInject';
  var fail = () => {
    if(toState.data.loggedIn)
      $state.transitionTo('yunity.login');
  }, success = () => {
    if(!toState.data.loggedIn)
      $state.transitionTo('app');
  };
  $rootScope.$on('$stateChangeStart',
  (event,  toState, toParams) => {
    Authentication.update();
    $rootScope.$on("authentication.update.success", success);
    $rootScope.$on("authentication.update.error", fail);
    $rootScope.$on("authentication.update.fail", fail);
  });
};

export default appRun;
