class MembersController {
  constructor(CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      groupData: CurrentGroup.value
    });
  }
}

export default MembersController;
