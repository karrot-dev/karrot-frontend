import UserListModule from "./userList";

describe("UserList", () => {
  let $ctrl;

  let { module } = angular.mock;

  beforeEach(module(UserListModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    let $componentController = $injector.get("$componentController");
    $ctrl = $componentController("userList", { }, { users: [1] });
    $ctrl.CurrentUsers.set([userOne]);
  }));

  let userOne = {
    "id": 1,
    "display_name": "Testuser1"
  };

  describe("Controller", () => {
    it("loads users",() => {
      expect($ctrl.getUsers()).to.deep.equal([userOne]);
    });

    it("loads and filters users",() => {
      $ctrl.searchQuery = "";
      expect($ctrl.getUsers()).to.deep.equal([userOne]);
      $ctrl.searchQuery = "TEST";
      expect($ctrl.getUsers()).to.deep.equal([userOne]);
      $ctrl.searchQuery = "test";
      expect($ctrl.getUsers()).to.deep.equal([userOne]);
      $ctrl.searchQuery = "else";
      expect($ctrl.getUsers()).to.deep.equal([]);
    });
  });
});
