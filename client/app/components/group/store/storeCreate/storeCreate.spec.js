import StoreCreateModule from "./storeCreate";

const { module } = angular.mock;

describe("StoreCreate", () => {
  beforeEach(module(StoreCreateModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeCreate", () => {
      expect(StoreCreateModule).to.equal("storeCreate");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend, $state;
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

    it("creates store", () => {
      let $ctrl = $componentController("storeCreate", {});
      let storeData = {
        name: "blabla",
        group: 5
      };
      $ctrl.submit(storeData);
      $httpBackend.expectPOST("/api/stores/", storeData).respond(201, { id: 987 });
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("^.store", { storeId: 987 });
    });
  });
});
