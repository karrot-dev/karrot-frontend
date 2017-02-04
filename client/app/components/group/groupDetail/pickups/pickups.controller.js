class PickupsController {
  constructor($stateParams) {
    "ngInject";
    this.pickupListOptions = {
      showDetail: "store",
      showTopbar: true,
      filter: {
        showJoined: true,
        showOpen: true,
        showFull: false
      },
      groupId: $stateParams.groupId
    };
  }
}

export default PickupsController;
