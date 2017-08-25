import ActivityDetailModule from "./activityDetail";

const { module } = angular.mock;

describe("ActivityDetail", () => {
  beforeEach(module(ActivityDetailModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named activityDetail", () => {
      expect(ActivityDetailModule).to.equal("activityDetail");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("activityDetail", {});
      expect($ctrl).to.exist;
    });
  });
});
