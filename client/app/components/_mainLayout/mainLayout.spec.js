import MainLayoutModule from "./mainLayout";

const { module } = angular.mock;

describe("MainLayout", () => {
  beforeEach(module(MainLayoutModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named mainLayout", () => {
      expect(MainLayoutModule).to.equal("mainLayout");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("mainLayout", {});
      expect($ctrl).to.exist;
    });
  });
});
