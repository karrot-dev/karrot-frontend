class ChatListController {
  constructor($document, $mdDialog, $state, GroupService, CurrentGroup, SessionUser) {
    "ngInject";
    Object.assign(this, {
      $document,
      $mdDialog,
      $state,
      GroupService,
      groups: [],
      CurrentGroup,
      SessionUser
    });
  }
  $onInit() {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
  }

  open($mdMenu, $event) {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
    $mdMenu.open($event);
  }
}

export default ChatListController;
