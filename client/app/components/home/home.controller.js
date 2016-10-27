class HomeController {
  constructor($state, Group) {
    "ngInject";
    this.$state = $state;
    this.Group = Group;

    this.name = "home";
    this.redirecting = true;

    this.Group.listMy().then((data) => {
      if (data.length > 0) {
        $state.go("groupDetail", { id: data[0].id });
      } else {
        this.redirecting = false;
        this.Group.list().then((data) => {
          this.groups = data.sort((a,b) => b.members.length - a.members.length);
        });
      }
    });
  }

  joinGroup (groupId) {
    this.redirecting = true;
    this.Group.join(groupId).then(() => {
      this.$state.go("groupDetail", { id: groupId });
    });
  }
}

export default HomeController;
