import LandingPageMapModule from "./landingPageMap";

const { module } = angular.mock;

describe("LandingPageMap", () => {
  beforeEach(module(LandingPageMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named landingPageMap", () => {
      expect(LandingPageMapModule).to.equal("landingPageMap");
    });
  });

  describe("Controller", () => {
    let $componentController, $rootScope, $q;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $rootScope = $injector.get("$rootScope");
      $q = $injector.get("$q");
    }));

    it("loads groupdata", () => {
      let $ctrl = $componentController("landingPageMap", {});
      sinon.stub($ctrl.GroupService, "list");
      $ctrl.GroupService.list.returns($q.resolve([{
        id: 99,
        name: "testgroup",
        public_description: "testgroup", // eslint-disable-line
        members: [1,2,3],
        latitude: 52.12,
        longitude: 23.1
      }]));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.markers).to.be.defined;
      expect($ctrl.markers[99].lat).to.equal(52.12);
    });
  });
});
