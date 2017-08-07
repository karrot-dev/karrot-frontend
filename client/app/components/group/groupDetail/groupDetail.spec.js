import GroupDetailModule from "./groupDetail";

const { module } = angular.mock;

describe("GroupDetail", () => {
  let $httpBackend, $q, $log;
  beforeEach(() => {
    module(($provide) => {
      $provide.value("Conversation", {
        subscribe() {
          return $q((resolve) => resolve({ unsubscribe() {} }));
        }
      });
    });
  });
  beforeEach(module(GroupDetailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));
  beforeEach(module({ translateFilter: (a) => a }));
  beforeEach(module(($mdAriaProvider) => {
    $mdAriaProvider.disableWarnings();
  }));

  beforeEach(inject(($injector) => {
    $q = $injector.get("$q");
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $httpBackend.whenGET("/api/stores/").respond([]);
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named groupDetail", () => {
      expect(GroupDetailModule).to.equal("groupDetail");
    });
  });

  describe("Controller", () => {
    let $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("highlights correct tab", () => {
      $httpBackend.expectGET("/api/groups/667/conversation/").respond({ id: 1 });
      let groupData = { id: 667, name: "blarb" };
      let $ctrl = $componentController("groupDetail", {});
      $ctrl.$state.current.name = "group.groupDetail.pickups";
      $ctrl.groupData = groupData;
      $ctrl.$onInit();
      $httpBackend.flush();
      expect($ctrl.currentNavItem).to.equal("pickups");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group-detail></group-detail>")(scope);
      $httpBackend.flush();
    });
  });
});
