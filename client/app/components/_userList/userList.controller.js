/**
 * TODOs
 *  open Edit Panel
 *  open User Page
 */

class UserListController {
  constructor(User) {
    "ngInject";

    this.User = User;

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

  onClick(user){
    if (angular.isDefined(this.callback)){
      this.callback(user);
    } else {
      //TODO: open user page
    }
  }

  editUser(){
    //TODO: Open Edit Panel
  }
}

export default UserListController;
