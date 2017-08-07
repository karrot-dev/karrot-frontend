/*

This code takes care of redirecting the user to perhaps more appropriate views

1. If member of the group: stay and set as currentGroup
2. If not member of the group: go to groupInfo page
3. If not logged in: go to groupInfo page

*/

export default (SessionUser, GroupService, $stateParams, CurrentGroup, $translate, $mdToast, $state) => {
  "ngInject";
  return SessionUser.loaded
  .then((user) => {
    return GroupService.get($stateParams.groupId).then((group) => {
      if (group.members.indexOf(user.id) >= 0) {
        CurrentGroup.set(group);
      } else {
        $translate("GROUP.NONMEMBER_REDIRECT").then((message) =>
          $mdToast.showSimple(message)
        );
        return $state.go("groupInfo", $stateParams);
      }
    });
  })
  .catch(() => {
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    return $state.go("groupInfo", $stateParams);
  });
};
