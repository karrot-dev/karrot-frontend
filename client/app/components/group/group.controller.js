class GroupController {
  constructor($state, $mdMedia) {
    "ngInject";

    if ($state.current.name === "group"){
      $state.go("group.groupDetail.pickups");
    }

    Object.assign(this, {
      $state,
      error: {
        leaveGroup: false
      },
      $mdMedia
    });
  }
}

export default GroupController;
