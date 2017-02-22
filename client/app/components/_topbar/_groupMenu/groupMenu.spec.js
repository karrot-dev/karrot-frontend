import GroupMenuModule from "./groupMenu";

const { module } = angular.mock;

describe("GroupMenu", () => {
  beforeEach(module(GroupMenuModule));

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
    let $componentController, $mdDialog, $state, $q, $rootScope, CurrentGroup, GroupService;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $mdDialog = $injector.get("$mdDialog");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      GroupService = $injector.get("GroupService");
      CurrentGroup = $injector.get("CurrentGroup");
      $rootScope = $injector.get("$rootScope");
      sinon.stub($mdDialog, "show");
      sinon.stub($state, "go");
      sinon.stub(GroupService, "listMy");
    }));

    it("opens join group dialog", () => {
      let $ctrl = $componentController("groupMenu", {});
      $mdDialog.show.returns($q((resolve) => {
        resolve(1337);
      }));
      $ctrl.openJoinGroupDialog();
      $rootScope.$apply();
      expect($state.go).to.have.been.calledWith( "group", { groupId: 1337 } );
    });

    it("goes to group", () => {
      let $ctrl = $componentController("groupMenu", {});
      CurrentGroup.set({ id: 84 });
      $ctrl.groupButton();
      expect($state.go).to.have.been.calledWith("group", { groupId: 84 });
    });

    it("goes to home", () => {
      let $ctrl = $componentController("groupMenu", {});
      $ctrl.groupButton();
      expect($state.go).to.have.been.calledWith("home");
    });

    it("gets data on init", () => {
      let $ctrl = $componentController("groupMenu", {});
      GroupService.listMy.returns($q((resolve) => {
        resolve([{ id: 85 }]);
      }));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect(GroupService.listMy).to.have.been.called;
      expect($ctrl.groups[0]).to.deep.equal({ id: 85 });
    });
  });
});
