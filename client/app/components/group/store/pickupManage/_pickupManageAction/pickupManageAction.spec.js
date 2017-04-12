import PickupManageActionModule from "./pickupManageAction";

const { module } = angular.mock;

describe("PickupManageAction", () => {
  beforeEach(module(PickupManageActionModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named pickupManageAction", () => {
      expect(PickupManageActionModule).to.equal("pickupManageAction");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("pickupManageAction", {});
      expect($ctrl).to.exist;
    });
  });
});
