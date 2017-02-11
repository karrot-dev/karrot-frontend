class PickupsController {
  constructor($stateParams) {
    "ngInject";
    Object.assign(this, {
      groupId: $stateParams.groupId,
      pickupListOptions: {
        showDetail: "store",
        showTopbar: false,
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
