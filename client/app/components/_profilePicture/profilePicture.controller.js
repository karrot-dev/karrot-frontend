class ProfilePictureController {
  constructor(CurrentUsers, $translate) {
    "ngInject";
    Object.assign(this, {
      CurrentUsers,
      $translate
    });
  }

  getUser() {
    return this.CurrentUsers.get(this.userId);
  }
}

export default ProfilePictureController;
