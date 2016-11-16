class HomeController {
  constructor($state, $document, $mdDialog, Group) {
    "ngInject";
    Object.assign(this, {
      $state,
      $document,
      $mdDialog,
      Group
    });

    this.Group.listMy().then((data) => {
      if (data.length > 0) {
        $state.go("groupDetail", { id: data[0].id });
      } else {
        this.openJoinGroupDialog();
      }
    });
  }

  openJoinGroupDialog($event) {
    let parentEl = this.$document.body;

    this.$mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      template: "<join-group></join-group>"
    }).then((groupId) => {
      this.$state.go("groupDetail", { id: groupId });
    });
  }


}

export default HomeController;
