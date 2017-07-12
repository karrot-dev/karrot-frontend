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

    it("should exist", () => {
      let $ctrl = $componentController("joinGroupList", {});
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
      $compile("<join-group-list></join-group-list>")(scope);
    });
  });
});
