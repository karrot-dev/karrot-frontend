import PasswordresetModule from "./passwordreset";

const { module } = angular.mock;

describe("Passwordreset", () => {
  beforeEach(module(PasswordresetModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named passwordreset", () => {
      expect(PasswordresetModule).to.equal("passwordreset");
    });
  });

  describe("Controller", () => {
    let $componentController, User, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      User = $injector.get("User");
      sinon.stub(User, "resetPassword");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("resets password", () => {
      let $ctrl = $componentController("passwordreset", {});
      User.resetPassword.returns($q((resolve) => {
        resolve();
      }));
      $ctrl.doReset();
      $rootScope.$apply();
      expect($ctrl.successful).to.be.true;
    });

    it("fails resetting password", () => {
      let $ctrl = $componentController("passwordreset", {});
      User.resetPassword.returns($q((resolve, reject) => {
        reject({ data: "message" });
      }));
      $ctrl.doReset();
      $rootScope.$apply();
      expect($ctrl.error).to.equal("message");
      expect($ctrl.successful).to.be.false;
    });
  });

  describe.skip("Route", () => {
    let $rootScope, $state;
    beforeEach(inject(($injector) => {
      $state = $injector.get("$state");
      $rootScope = $injector.get("$rootScope");
    }));

    it("sets state", () => {
      $state.go("passwordreset");
      $rootScope.$apply();
      expect($state.current.component).to.equal("passwordreset");
    });
  });
});
