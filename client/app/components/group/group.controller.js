class GroupController {
  constructor($state, $scope, $mdMedia) {
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
