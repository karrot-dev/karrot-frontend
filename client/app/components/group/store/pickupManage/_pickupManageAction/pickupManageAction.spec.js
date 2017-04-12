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
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("triggers edit dialog", () => {
      let $ctrl = $componentController("pickupManageAction", {}, {
        flags: { isSeries: false },
        data: { id: 5 },
        onEdit: sinon.stub()
      });
      $ctrl.onEdit.returns($q.resolve());
      $ctrl.triggerEdit("$event");
      $rootScope.$apply();
      expect($ctrl.onEdit).to.have.been.calledWith({
        $event: "$event", config: { series: false, data: { id: 5 } }
      });
    });

    it("triggers delete dialog", () => {
      let $ctrl = $componentController("pickupManageAction", {}, {
        flags: { isSeries: false },
        data: { id: 5 },
        onDelete: sinon.stub()
      });
      $ctrl.onDelete.returns($q.resolve());
      $ctrl.triggerDelete("$event");
      $rootScope.$apply();
      expect($ctrl.onDelete).to.have.been.calledWith({
        $event: "$event", config: { series: false, data: { id: 5 } }
      });
    });
  });
});
