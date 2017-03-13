import StoreEditModule from "./storeEdit";

const { module } = angular.mock;

describe("StoreEdit", () => {
  beforeEach(module(StoreEditModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeEdit", () => {
      expect(StoreEditModule).to.equal("storeEdit");
    });
  });


  describe("Controller", () => {
    let $componentController, $state, $httpBackend;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
      $state = $injector.get("$state");
      sinon.stub($state, "go");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("modifies store", () => {
      let $ctrl = $componentController("storeEdit", {});
      let storedata = {
        id: 85,
        name: "blabla"
      };
      $ctrl.submit(storedata);
      $httpBackend.expectPATCH("/api/stores/85/", storedata).respond(200, storedata);
      $httpBackend.flush();
      expect($state.go).to.have.been.called;
    });
  });
});
