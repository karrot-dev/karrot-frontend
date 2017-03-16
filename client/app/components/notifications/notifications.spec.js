import NotificationsModule from "./notifications";

const { module } = angular.mock;

describe("Notifications", () => {
  beforeEach(module(NotificationsModule));
  beforeEach(module({ $translate: sinon.mock() }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named notifications", () => {
      expect(NotificationsModule).to.equal("notifications");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("shows & resends verification", () => {
      let $ctrl = $componentController("notifications", {}, {
        userdata: { "mail_verified": false }
      });
      expect($ctrl.isVerified()).to.be.false;

      inject(($q, $rootScope) => {
        $ctrl.$translate.returns($q.resolve("msg"));
        sinon.stub($ctrl.User, "resendVerificationRequest");
        $ctrl.User.resendVerificationRequest.returns($q.resolve());
        sinon.stub($ctrl.$mdToast, "showSimple");
        $ctrl.sendVerification();
        $rootScope.$apply();
        expect($ctrl.User.resendVerificationRequest).to.have.been.called;
        expect($ctrl.$mdToast.showSimple).to.have.been.calledWith("msg");
      });
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<notifications></notifications>")(scope);
    });
  });
});
