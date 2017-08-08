/*

This code takes care of redirecting the user to perhaps more appropriate views

1. If member of the group: stay and set as currentGroup
2. If not member of the group: go to groupInfo page
3. If not logged in: go to groupInfo page

It can be imported and included in the state resolve config:

.state("group", {
  url: "/group/{groupId:int}",
  component: "group",
  resolve: {
    beMemberOrRedirect
  }
}

It also loads group data into the CurrentGroup service, which persists it for the user on the back-end

*/

export default (
  Authentication, GroupService, $stateParams,
  CurrentGroup, $translate, $mdToast, $state, $q, $timeout
) => {
  "ngInject";
  return Authentication.update()
  .then((user) => {
    return GroupService.get($stateParams.groupId).then((group) => {
      if (group.members.indexOf(user.id) >= 0) {
        CurrentGroup.set(group);

      } else {
        $translate("GROUP.NONMEMBER_REDIRECT").then((message) =>
          $mdToast.showSimple(message)
        );
        $state.go("groupInfo", $stateParams);
        return $q.reject("reason");
      }
    });
  })
  .catch(() => {
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    $timeout(() => $state.go("groupInfo", $stateParams));
    return $q.reject("reason");
  });
};
