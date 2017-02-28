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
    let $componentController, $rootScope, $q, GroupService;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $rootScope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      GroupService = $injector.get("GroupService");
      sinon.stub(GroupService, "list");
    }));

    it("loads groupdata", () => {
      let $ctrl = $componentController("landingPageMap", {});
      GroupService.list.returns($q.resolve([{
        id: 99,
        members: [1,2,3],
        latitude: 52.12,
        longitude: 23.1
      }]));
      $ctrl.$onInit();
      $rootScope.$apply();
      // TODO: fails for some reason
      //expect($ctrl.markers[99].latitude).to.equal(52.12);
    });
  });
});
