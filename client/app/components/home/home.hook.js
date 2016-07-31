let homeHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'home.*'},
    (transition) => {
      var auth=transition.injector().get('Authentication'),
          $state=transition.injector().get('$state');
      return auth.update().then(() => {
        return true;
      }, () => {
        return $state.target('login');
      });
    }
  );
}

export default homeHook;
