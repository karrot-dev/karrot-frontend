import PickupsModule from "./pickups";

const { module } = angular.mock;

describe("Pickups", () => {
  beforeEach(module(PickupsModule));
  beforeEach(module({ translateFilter: (a) => a }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named pickups", () => {
      expect(PickupsModule).to.equal("pickups");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("pickups", {});
      expect($ctrl).to.exist;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector, $stateParams) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
      $stateParams.groupId = 5;
    }));

    it("compiles component", () => {
      $compile("<pickups></pickups>")(scope);
    });
  });
});
