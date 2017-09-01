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
  CurrentGroup, $translate, $mdToast, $state, $q
) => {
  "ngInject";
  return Authentication.update()
  .then((user) => {
    return GroupService.get($stateParams.groupId)
      .then((group) => {
        if (group.members.includes(user.id)) {
          CurrentGroup.set(group);

        } else {
          $translate("GROUP.NONMEMBER_REDIRECT").then((message) =>
            $mdToast.showSimple(message)
          );
          return $q.reject({ error: "not_a_member" });
        }
      })
      .catch((error) => {
        if (error.error !== "not_a_member"){
          return $q.reject({ error: "not_found" });
        }
        return $q.reject(error);
      });
  })
  .catch(({ error }) => {
    if (error === "not_found"){
      $state.go("notFound");
      return;
    } else if (error === "not_a_member"){
      $state.go("groupInfo", $stateParams);
      return;
    }
    $translate("GLOBAL.NOT_LOGGED_IN").then((message) => {
      $mdToast.showSimple(message);
    });
    $state.go("login");
    return;
  });
};
