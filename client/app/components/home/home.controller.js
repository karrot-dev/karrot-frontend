class HomeController {
  constructor($state, Group) {
    "ngInject";
    this.name = "home";
    this.redirecting = true;
    Group.listMy().then((data) => {
      if (data.length > 0) {
        $state.go("groupDetail", { id: data[0].id });
      } else {
        this.redirecting = false;
      }
    });
  }
}

export default HomeController;
