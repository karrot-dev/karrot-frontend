class StoresController {
  constructor($stateParams) {
    "ngInject";
    Object.assign(this, {
      groupId: $stateParams.groupId
    });
  }
}

export default StoresController;
