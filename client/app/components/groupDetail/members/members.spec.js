import MembersModule from "./members";

const { module } = angular.mock;

describe("Members", () => {
  beforeEach(module(MembersModule));

  /*
  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named members", () => {
      expect(MembersModule).to.equal("members");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("members", {});
      expect($ctrl).to.exist;
    });
  });
  */
});
