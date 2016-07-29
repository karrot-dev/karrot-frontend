let loginHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'login'},
    (transition) => {
      var auth=transition.injector().get('Authentication');
      return !auth.isLoggedIn;
    }
  );
};

export default loginHook;
