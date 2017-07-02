import GroupMenuModule from "./groupMenu";

const { module } = angular.mock;

describe("GroupMenu", () => {
  beforeEach(module(GroupMenuModule));
  beforeEach(module({ translateFilter: (a) => a }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupMenu", () => {
      expect(GroupMenuModule).to.equal("groupMenu");
    });
  });

  describe("Controller", () => {
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("opens join group dialog", () => {
      let $ctrl = $componentController("groupMenu", {});
      sinon.stub($ctrl.$mdDialog, "show");
      sinon.stub($ctrl.$state, "go");
      $ctrl.$mdDialog.show.returns($q.resolve(1337));
      $ctrl.openJoinGroupDialog();
      $rootScope.$apply();
      expect($ctrl.$state.go).to.have.been.calledWith( "group", { groupId: 1337 } );
    });

    it("goes to group", () => {
      let $ctrl = $componentController("groupMenu", {});
      sinon.stub($ctrl.$state, "go");
      sinon.stub($ctrl.CurrentGroup, "persistCurrentGroup");
      $ctrl.CurrentGroup.set({ id: 84 });
      $ctrl.groupButton();
      expect($ctrl.CurrentGroup.persistCurrentGroup).to.have.been.called;
      expect($ctrl.$state.go).to.have.been.calledWith("group", { groupId: 84 });
    });

    it("goes to home", () => {
      let $ctrl = $componentController("groupMenu", {});
      sinon.stub($ctrl.$state, "go");
      $ctrl.groupButton();
      expect($ctrl.$state.go).to.have.been.calledWith("home");
    });

    it("gets data on init", () => {
      let $ctrl = $componentController("groupMenu", {});
      sinon.stub($ctrl.GroupService, "listMy");
      $ctrl.GroupService.listMy.returns($q.resolve([{ id: 85 }]));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.GroupService.listMy).to.have.been.called;
      expect($ctrl.groups[0]).to.deep.equal({ id: 85 });
    });

    it("gets group name from CurrentGroup", () => {
      let $ctrl = $componentController("groupMenu", {});
      $ctrl.CurrentGroup.value = { name: "my group" };
      expect($ctrl.getGroupName()).to.equal("my group");
    });

    it("gets group name via SessionUser", () => {
      let $ctrl = $componentController("groupMenu", {});
      $ctrl.SessionUser.value = { "current_group": 5 };
      $ctrl.groups = [{ id: 5, name: "my group 5" }];
      expect($ctrl.getGroupName()).to.equal("my group 5");
    });

    it("can't get group name", () => {
      let $ctrl = $componentController("groupMenu", {});
      expect($ctrl.getGroupName()).to.be.undefined;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group-menu></group-menu>")(scope);
    });
  });
});
