import GroupActivityModule from "./groupActivity";

const { module } = angular.mock;

describe("GroupActivity", () => {
  beforeEach(module(GroupActivityModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupActivity", () => {
      expect(GroupActivityModule).to.equal("groupActivity");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("groupActivity", {});
      expect($ctrl).to.exist;
    });
  });
});
