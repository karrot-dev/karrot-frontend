class ProfilePictureController {
  constructor(User, $translate) {
    "ngInject";
    Object.assign(this, {
      User,
      $translate
    });
  }
  $onInit() {
    this.User.get(this.userId).then((res) => {
      this.name = res.display_name;
      if (res.profile_picture) {
        // not implemented in the backend yet
        this.picture = res.profile_picture;
      }
    }).catch(() => {
      this.$translate("PROFILE.INACCESSIBLE_OR_DELETED").then((text) => {
        this.name = text;
      });
    });
  }
}

export default ProfilePictureController;
