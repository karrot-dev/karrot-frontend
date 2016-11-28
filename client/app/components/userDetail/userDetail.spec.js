import UserDetailModule from "./userDetail";

const { module } = angular.mock;

describe("UserDetail", () => {
  beforeEach(module(UserDetailModule));

  describe("Module", () => {
    it("is named userDetail", () => {
      expect(UserDetailModule).to.equal("userDetail");
    });
  });

  describe("Config", () => {
    let $state, $httpBackend;

    beforeEach(module(($stateProvider) => {
      $stateProvider
        .state("main", { url: "", abstract: true });
    }));

    beforeEach(inject(($injector) => {
      $state = $injector.get("$state");
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("provides state", () => {
      $httpBackend.expectGET("/api/auth/status/").respond( { id: 99 });
      $httpBackend.expectGET("/api/users/5/").respond( { id: 5 });
      $state.go("userDetail", { id: 5 });
      $httpBackend.flush();
    });
  });

  describe("Controller", () => {
    let $ctrl;
    beforeEach(inject((_$componentController_) => {
      $ctrl = _$componentController_("userDetail", {});
    }));
    it("to exist", () => {
      expect($ctrl).to.exist;
    });
  });
});
