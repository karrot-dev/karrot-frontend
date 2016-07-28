let homeHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'home.*'},
    (transition) => {
      var auth=transition.injector().get('Authentication'),
          $state=transition.injector().get('$state');
      console.log("to home!");
      return new Promise((resolve, reject) => {
        auth.update();
        $rootScope.
          $on('authentication.update.success', () => {resolve()});
        $rootScope.
          $on('authentication.update.error', () => {reject()});
        $rootScope.
          $on('authentication.update.fail', () => {reject()});
      }).then(() => {
        return true;
      }, () => {
        return $state.target('login');
      });
    }
  );
}

export default homeHook;
