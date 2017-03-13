import GroupPopupModule from "./groupPopup";

const { module } = angular.mock;

describe("GroupPopup", () => {
  beforeEach(module(GroupPopupModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupPopup", () => {
      expect(GroupPopupModule).to.equal("groupPopup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("groupPopup", {});
      expect($ctrl).to.exist;
    });
  });
});
