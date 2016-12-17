class GroupDetailController {
  constructor($state, $mdMedia) {
    "ngInject";

    let currentState = $state.current.name;
    if (currentState === "groupDetail"){
      $state.go("groupDetail.group.pickups");
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

export default GroupDetailController;
