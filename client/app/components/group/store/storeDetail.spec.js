import StoreDetailModule from "./storeDetail";
import StorePickupsModule from "./storePickups/storePickups";
import GroupComponentModule from "../group";

const { module } = angular.mock;

describe("StoreDetail", () => {
  beforeEach(module(StoreDetailModule));
  beforeEach(module(GroupComponentModule));
  beforeEach(module(StorePickupsModule));  // to test redirection
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true })
      .state("groupInfo", { url: "g" });
  }));
  beforeEach(module({
    $translate: sinon.stub(),
    translateFilter: (a) => a
  }));
  beforeEach(module(($mdAriaProvider) => {
    $mdAriaProvider.disableWarnings();
  }));

  let $log, $httpBackend, $state;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeDetail", () => {
      expect(StoreDetailModule).to.equal("storeDetail");
    });
  });

  describe("Routes", () => {
    it("should load store and group information", () => {
      inject((CurrentGroup, GroupService, Store, $q, CurrentStores, $rootScope, Authentication, $translate) => {
        $translate.returns($q.resolve());
        let groupData = { id: 12, members: [43] };
        let storeData = { id: 25, group: groupData.id };

        $httpBackend.whenGET(`/api/groups/${groupData.id}/`).respond(groupData);
        sinon.stub(CurrentGroup, "set").returns($q.resolve(groupData));
        sinon.stub(Store, "get").returns($q.resolve(storeData));
        sinon.stub(Authentication, "update").returns($q.resolve({ id: 43 }));
        $rootScope.$apply();
        expect(
          $state.go("group.store", { storeId: storeData.id, groupId: groupData.id })
        ).to.eventually.be.fulfilled;
        $httpBackend.flush();
        expect($state.current.component).to.equal("storePickups");
        expect(CurrentGroup.set).to.have.been.calledWith(groupData);
        expect(Store.get).to.have.been.calledWith(storeData.id);
        expect(CurrentStores.selected).to.deep.equal(storeData);
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
      $httpBackend.expectGET("/api/stores/").respond([]);
      $compile("<store-detail></store-detail>")(scope);
      $httpBackend.flush();
    });
  });
});
