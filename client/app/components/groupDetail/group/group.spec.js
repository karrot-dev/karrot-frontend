import GroupModule from "./group";

const { module } = angular.mock;

describe("Group", () => {
  beforeEach(module(Authentication));
  beforeEach(module(GroupModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named group", () => {
      expect(GroupModule).to.equal("group");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("group", {});
      expect($ctrl).to.exist;
    });
  });
});
