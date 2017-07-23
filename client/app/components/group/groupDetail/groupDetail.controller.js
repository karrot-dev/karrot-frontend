class GroupDetailController {
  constructor(CurrentGroup, $state, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      groupData: CurrentGroup.value,
      $state,
      $mdMedia
    });
  }

  $onInit() {
    // set currentNavItem on redirect
    this.currentNavItem = this.$state.current.name.replace("group.groupDetail.", "");
  }
}

export default GroupDetailController;
