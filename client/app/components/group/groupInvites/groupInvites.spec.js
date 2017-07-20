import GroupInvitesModule from "./groupInvites";

const { module } = angular.mock;

describe("GroupInvites", () => {
  beforeEach(module(GroupInvitesModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupInvites", () => {
      expect(GroupInvitesModule).to.equal("groupInvites");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("groupInvites", {});
      expect($ctrl).to.exist;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group-invites></group-invites>")(scope);
    });
  });
});
