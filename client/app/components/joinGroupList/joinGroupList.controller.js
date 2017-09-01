class JoinGroupListController {
  constructor(SessionUser) {
    "ngInject";
    Object.assign(this, {
      SessionUser,
      sortedGroups: []
    });
  }

  $onInit() {
    if (angular.isDefined(this.groups)){
      this.sortedGroups = this.groups
      .filter(this.isNotMember.bind(this))
      .sort(this.highestMemberCountFirst);
    }
  }

  isNotMember(group) {
    return this.SessionUser.isLoggedIn() ? !group.members.includes(this.SessionUser.value.id) : true;
  }

  highestMemberCountFirst(a, b) {
    return b.members.length - a.members.length;
  }
}

export default JoinGroupListController;
