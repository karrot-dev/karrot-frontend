class GroupDetailController {
  constructor($state, $mdMedia) {
    "ngInject";

    Object.assign(this, {
      $state,
      error: {
        leaveGroup: false
      },
      $mdMedia
    });
  }
  
  $onChanges($state) {
    if (this.$state.current.name === "group"){
      this.$state.go("group.groupDetail.pickups");
    }
    console.log(this.$state.current.name);
  }
}

export default GroupDetailController;
