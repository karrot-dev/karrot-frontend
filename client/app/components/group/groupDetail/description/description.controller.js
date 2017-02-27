class DescriptionController {
  constructor(CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      groupData: CurrentGroup.value
    });
  }
}

export default DescriptionController;
