class UserListController {
  constructor(CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      CurrentUsers,
      searchQuery: ""
    });
  }

  getUsers(){
    return this.users.map((id) => {
      return this.CurrentUsers.get(id);
    }).filter((e) => {
      if (angular.isDefined(e)) {
        if (this.searchQuery === "") return true;
        return e.display_name.toLowerCase().includes(this.searchQuery.toLowerCase());
      }
      return false;
    });
  }
}

export default UserListController;
