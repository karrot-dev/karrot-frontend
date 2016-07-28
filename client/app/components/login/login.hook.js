let loginHook = ($transitions) => {
  'ngInject';
  $transitions.onBefore(
    {to: 'login'},
    () => {
      'ngInject';
      console.log("to login!");
      return true;
      //return Authentication.isLoggedIn;
    }
  );
};

export default loginHook;
