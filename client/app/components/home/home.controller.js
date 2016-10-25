class HomeController {
  constructor($state, Group) {
    "ngInject";
    this.name = "home";
    Group.listMy().then((data) => {
      if (data.length > 0)
        $state.go("groupDetail", { id: data[0].id });
    });
  }
}

export default HomeController;
