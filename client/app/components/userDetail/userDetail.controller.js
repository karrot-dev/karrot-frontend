class UserDetailController {
  constructor(User, SessionUser, $state) {
    "ngInject";
    Object.assign(this, {
      User,
      SessionUser,
      $state,
      markers: {},
      center: {},
      editEnabled: false,
      isLocated: false
    });
  }

  $onInit(){
    this.updateMap();
  }

  updateMap(){
    if (angular.isDefined(this.userdata)
            && this.userdata.latitude !== null
            && this.userdata.longitude !== null){
      this.setMarker(this.userdata.latitude, this.userdata.longitude, 14);
      this.isLocated = true;
    }
  }

  $onChanges(changes) {
    if (changes.userdata && changes.userdata.currentValue) {
      this.SessionUser.loaded.then((data) => {
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
      this.updateMap();
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

  mailIsDifferent(user) {
    if (angular.isString(user.unverified_email)) {
      return user.email !== user.unverified_email;
    }
    return false;
  }

  setMarker(lat, lng, message) {
    this.markers = {
      pin: {
        lat,
        lng,
        draggable: false,
        message
      }
    };
    this.center = {
      lat,
      lng,
      zoom: 16
    };
  }
}

export default UserDetailController;
