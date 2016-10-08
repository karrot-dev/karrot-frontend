import angular from "angular";

const setReaction = ($state, reaction, reactionHook) => {
  return () => {
    let r;
    if (angular.isString(reaction)) {
      r = $state.target(reaction);
    }
    r = reaction;
    if (angular.isFunction(reactionHook)) {
      reactionHook(r);
    }
    return r;
  };
};

const hookFactory = (target, detour = { authenticated: true, anonymous: "login" }, reactionHook) => {
  let hook = ($transitions) => {
    "ngInject";
    $transitions.onBefore(
      { to: target },
      (transition) => {
        let auth = transition.injector().get("Authentication"),
          $state = transition.injector().get("$state");
        return auth.update()
          .then(setReaction($state, detour.authenticated, reactionHook))
          .catch(setReaction($state, detour.anonymous, reactionHook));
      }
    );
  };
  return hook;
};

export default hookFactory;
