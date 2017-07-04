class HomeController {
  constructor($state, GroupService, SessionUser) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService,
      SessionUser
    });
  }

  $onInit() {
    if (this.SessionUser.value.current_group !== null) {
      this.$state.go("group", { groupId: this.SessionUser.value.current_group });
    } else {
      this.GroupService.listMy().then((data) => {
        if (data.length > 0) {
          this.$state.go("group", { groupId: data[0].id });
        } else {
          this.$state.go("groupList");
        }
      });
    }
  }
}

export default HomeController;
