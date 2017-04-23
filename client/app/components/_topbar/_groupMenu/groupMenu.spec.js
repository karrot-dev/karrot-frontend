import GroupMenuModule from "./groupMenu";
import User from "../../../services/user/user";

const { module } = angular.mock;

describe("GroupMenu", () => {
  beforeEach(module(GroupMenuModule));
  beforeEach(module(User));

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
      $ctrl.$mdDialog.show.returns($q((resolve) => {
        resolve(1337);
      }));
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
      $ctrl.GroupService.listMy.returns($q((resolve) => {
        resolve([{ id: 85 }]);
      }));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.GroupService.listMy).to.have.been.called;
      expect($ctrl.groups[0]).to.deep.equal({ id: 85 });
    });
  });
});
