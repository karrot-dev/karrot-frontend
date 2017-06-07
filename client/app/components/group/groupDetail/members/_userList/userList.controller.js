class UserListController {
  constructor(CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      CurrentUsers,
      searchQuery: ""
    });
  }

  $onInit() {
    // check if users it's a list of IDs or Users
    if (angular.isDefined(this.users) && this.users.length > 0 && angular.isNumber(this.users[0])){
      this.userData = [];
      this.getUsers();
    } else {
      this.userData = this.users;
    }
  }

  /*
   * gets all users in this.users id-array, and saves the result in userData
   */
  getUsers(){
    return this.users.map((id) => {
      return this.CurrentUsers.get(id);
    }).filter((e) => {
      if (angular.isDefined(e)) {
        if (this.searchQuery === "") return true;
        return e.display_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
      }
      return false;
    });
  }
}

export default UserListController;
