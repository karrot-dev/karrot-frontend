import HomeModule from "./home";

const { module } = angular.mock;

describe("Home", () => {
  beforeEach(() => {
    module(HomeModule);
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named home", () => {
      expect(HomeModule).to.equal("home");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend, $state, $mdDialog, $q, Authentication;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");

      Authentication = $injector.get("Authentication");
      Authentication.data = { id: 1 };

      $mdDialog = $injector.get("$mdDialog");
      sinon.stub($mdDialog, "show");

      $state = $injector.get("$state");
      sinon.stub($state, "go");

      $q = $injector.get("$q");
    }));

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
      expect($state.go).to.have.been.calledWith("groupDetail", { groupId: 50 });
    });

    it("opens join group dialog", () => {
      $httpBackend.expectGET("/api/groups/?members=1").respond(200, {});
      $mdDialog.show.returns($q((resolve) => {
        resolve(1337);
      }));
      $componentController("home", {});
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith( "groupDetail", { groupId: 1337 } );
    });
  });
});
