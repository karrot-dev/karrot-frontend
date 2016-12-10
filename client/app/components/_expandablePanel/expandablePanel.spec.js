import ExpandablePanelModule from "./expandablePanel";

const { module } = angular.mock;

describe("ExpandablePanel", () => {
  beforeEach(module(ExpandablePanelModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named expandablePanel", () => {
      expect(ExpandablePanelModule).to.equal("expandablePanel");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("expandablePanel", {});
      expect($ctrl).to.exist;
    });
  });
});
