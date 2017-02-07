class PickupsController {
  constructor($stateParams) {
    "ngInject";
    Object.assign(this, {
      groupId: $stateParams.groupId,
      pickupListOptions: {
        showDetail: "store",
        showTopbar: true,
        filter: {
          showJoined: true,
          showOpen: true,
          showFull: false
        }
      }
    });
  }
}

export default PickupsController;
