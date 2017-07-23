import JoinGroupListModule from "./joinGroupList";

const { module } = angular.mock;

describe("JoinGroupList", () => {
  beforeEach(module(JoinGroupListModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named joinGroupList", () => {
      expect(JoinGroupListModule).to.equal("joinGroupList");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("checks if user is member", () => {
      let $ctrl = $componentController("joinGroupList", {});
      expect($ctrl.isNotMember({
        members: [5]
      })).to.be.true;

      $ctrl.SessionUser.set({ id: 5 });
      expect($ctrl.isNotMember({
        members: []
      })).to.be.true;
      expect($ctrl.isNotMember({
        members: [5]
      })).to.be.false;
    });

    it("sorts by member count", () => {
      let $ctrl = $componentController("joinGroupList", {});
      expect($ctrl.highestMemberCountFirst({ members: [1,2] }, { members: [] }) < 0).to.be.true;
    });

    it("filters and sorts groups on init", () => {
      let $ctrl = $componentController("joinGroupList", {});
      $ctrl.$onInit();

      $ctrl = $componentController("joinGroupList", {}, { groups: [{ members: [3] }] });
      $ctrl.$onInit();
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<join-group-list></join-group-list>")(scope);
    });
  });
});
