class GroupController {
  constructor($state, $scope, $mdMedia) {
    "ngInject";

    if ($state.current.name === "group"){
      $state.go("group.groupDetail.pickups");
    }

    $scope.$watch(() => {
      return $state.$current.name;
    }, (newVal) => {
      if (newVal === "group"){
        $state.go("group.groupDetail.pickups");
      }
    }) ;

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
