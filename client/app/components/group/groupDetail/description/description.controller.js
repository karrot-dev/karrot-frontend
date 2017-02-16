class DescriptionController {
  constructor($state) {
    "ngInject";
    Object.assign(this, {
      groupData: $state.groupData
    });
  }
}

export default DescriptionController;
