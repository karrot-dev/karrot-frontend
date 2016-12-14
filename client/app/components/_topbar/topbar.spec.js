import TopbarModule from "./topbar";
import TopbarController from "./topbar.controller";

const { module } = angular.mock;

describe("Topbar", () => {
  beforeEach(module(TopbarModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Controller", () => {
    let $ctrl, Authentication, $q, $rootScope;

    beforeEach(inject(($injector, _$componentController_) => {
      Authentication = $injector.get("Authentication");
      sinon.stub(Authentication, "update");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
      $ctrl = _$componentController_("topbar", {});
    }));

    it("calls $onInit", () => {
      let userData = { id: 5, "display_name": "abc" };
      Authentication.update.returns($q((resolve) => {
        resolve(userData);
      }));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect(Authentication.update).has.been.called;
      expect($ctrl.loggedInUser).to.deep.equal(userData);
    });
  });
});
