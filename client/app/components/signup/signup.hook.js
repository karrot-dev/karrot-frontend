let signupHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'signup'},
    (transition) => {
      var auth=transition.injector().get('Authentication'),
          $state=transition.injector().get('$state');
      return auth.update().then(() => {
        return $state.target('home');
      }, () => {
        return true;
      });
    }
  );
};

export default signupHook;
