class JoinGroupListController {
  constructor(Authentication) {
    "ngInject";
    Object.assign(this, {
      Authentication
    });
  }

  $onInit(){
    let sortedGroups = [];
    if (angular.isDefined(this.groups)){
      sortedGroups = this.groups.sort((a,b) => b.members.length - a.members.length);
    }
    this.Authentication.update().then((data) => {
      let groupsUserIsMember = [];
      angular.forEach(sortedGroups, (curGroup) => {
        if (curGroup.members.indexOf(data.id) === -1){
          groupsUserIsMember.push(curGroup);
        }
      });
      this.groupsUserIsMemberOf = groupsUserIsMember;
    });
  }
}

export default JoinGroupListController;
