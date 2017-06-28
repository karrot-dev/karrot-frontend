class GroupPopupController {
  constructor(GroupService) {
    "ngInject";
    Object.assign(this, {
      GroupService
    });
  }

  $onInit(){
    this.GroupService.get(parseInt(this.id)).then((groupData) => {
      this.groupData = groupData;
    });
  }
}

export default GroupPopupController;
