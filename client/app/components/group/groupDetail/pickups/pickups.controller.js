class PickupsController {
  constructor($stateParams) {
    "ngInject";
    this.groupId = $stateParams.groupId;

    this.pickupListOptions = {
      showDetail: "store",
      showTopbar: true,
      filter: {
        showJoined: true,
        showOpen: true,
        showFull: false
      }
    };
  }
}

export default PickupsController;
