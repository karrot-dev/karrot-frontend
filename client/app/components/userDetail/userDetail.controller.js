class UserDetailController {
  constructor(User, Authentication, $state) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      $state,
      editEnabled: false
    });
  }

  $onChanges(changes) {
    if (changes.userdata && changes.userdata.currentValue) {
      this.Authentication.update().then((data) => {
        // check if the user can edit his own page
        this.editable = data.id === changes.userdata.currentValue.id;
      });
    }
  }

  editEnable() {
    this.editData = angular.copy(this.userdata);
    this.editEnabled = true;
  }

  submitEdit() {
    return this.User.save(this.editData).then((data) => {
      this.userdata = data;
      this.stopEdit();
      if (this.isChangePassword) {
        this.$state.go("login");
      }
    }).catch((err) => {
      this.error = err.data;
    });
  }

  stopEdit() {
    this.editEnabled = false;
  }
}

export default UserDetailController;
