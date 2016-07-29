let homeHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'home.*'},
    (transition) => {
      var auth=transition.injector().get('Authentication'),
          $state=transition.injector().get('$state'),
          $rootScope=transition.injector().get('$rootScope');
      return new Promise((resolve, reject) => {
        auth.update();
        return new Promise((resolve, reject) => {
          $rootScope.
            $on('authentication.update.success', () => {resolve()});
          $rootScope.
            $on('authentication.update.error', () => {reject()});
          $rootScope.
            $on('authentication.update.fail', () => {reject()});
        }).then(() => {resolve();}, () => {reject();});
      }).then(() => {
        return true;
      }, () => {
        return $state.target('login');
      });
    }
  );
}

export default homeHook;
