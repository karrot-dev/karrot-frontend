import StoreCreateModule from "./storeCreate";

const { module } = angular.mock;

describe("StoreCreate", () => {
  beforeEach(module(StoreCreateModule));
  beforeEach(module({ translateFilter: (a) => a }));

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
    let $componentController, $httpBackend;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
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
      sinon.stub($ctrl.$state, "go");
      $httpBackend.flush();
      expect($ctrl.$state.go).to.have.been.calledWith("^.store", { storeId: 987 });
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<store-create></store-create>")(scope);
    });
  });
});
