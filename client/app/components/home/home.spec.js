import HomeModule from "./home";

const { module } = angular.mock;

describe("Home", () => {
  beforeEach(() => {
    module(HomeModule);
  });

  describe("Module", () => {
    it("is named home", () => {
      expect(HomeModule).to.equal("home");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend, $state, Authentication;
    beforeEach(() => {
      inject((_$componentController_, _$httpBackend_, _$state_, _Authentication_) => {
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $state = _$state_;
        Authentication = _Authentication_;
      });
      Authentication.data = { id: 1 };
      sinon.stub($state, "go");
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    let groupData = [
      { id: 50 },
      { id: 99 }
    ];

    it("should redirect user", () => {
      $httpBackend.expectGET("/api/groups/?members=1").respond(200, groupData);
      $componentController("home", {});
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("groupDetail", { id: 50 });
    });
  });
});
