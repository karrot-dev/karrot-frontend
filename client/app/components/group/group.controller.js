class GroupController {
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
}

export default GroupController;
