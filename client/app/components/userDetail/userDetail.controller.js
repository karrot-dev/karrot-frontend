class UserDetailController {
  constructor(User, Authentication) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      editEnabled: false
    });
  }

  $onChanges(changes) {
    if (changes.userdata && changes.userdata.currentValue) {
      this.Authentication.update().then((data) => {
        this.editable = data.id === changes.userdata.currentValue.id;
      });
    }
  }

  editEnable() {
    this.editData = angular.copy(this.userdata);
    this.editEnabled = true;
    this.saving = false;
  }

  submitEdit() {
    this.saving = true;
    this.User.save(this.editData).then((data) => {
      this.userdata = data;
      this.stopEdit();
    });
  }

  stopEdit() {
    this.editEnabled = false;
    this.saving = false;
  }
}

export default UserDetailController;
