class StoresController {
  constructor($stateParams) {
    "ngInject";

    this.groupId = $stateParams.groupId;
  }
}

export default StoresController;
