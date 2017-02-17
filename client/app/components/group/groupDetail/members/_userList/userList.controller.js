class UserListController {
  constructor(User) {
    "ngInject";
    Object.assign(this, {
      User
    });
  }

  $onInit() {
    // check if users it's a list of IDs or Users
    if (angular.isNumber(this.users[0])){
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
    angular.forEach(this.users, (userID) => {
      this.User.get(userID).then((data) => this.userData.push(data));
    });
  }
}

export default UserListController;
