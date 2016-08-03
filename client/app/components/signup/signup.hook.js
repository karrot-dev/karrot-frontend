let signupHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'signup'},
    (transition) => {
      var auth=transition.injector().get('Authentication');
      return !auth.isLoggedIn;
    }
  );
};

export default signupHook;
