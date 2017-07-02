import GroupEditCreateFormModule from "./groupEditCreateForm";

const { module } = angular.mock;

describe("GroupEditCreateForm", () => {
  beforeEach(module(GroupEditCreateFormModule));
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
    it("is named groupEditCreateForm", () => {
      expect(GroupEditCreateFormModule).to.equal("groupEditCreateForm");
    });
  });

  describe("Controller", () => {
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("initializes from binding", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.query).to.equal("he");
      expect($ctrl.marker.p.lng).to.equal(3);
      expect($ctrl.isCreate).to.be.undefined;
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.$onInit();
      expect($ctrl.query).to.be.undefined;
      expect($ctrl.marker).to.be.undefined;
      expect($ctrl.isCreate).to.be.true;
    });

    it("submits data with error", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      let err = { data: "err" };
      $ctrl.onSubmit = () => $q.reject(err);
      $ctrl.submit();
      $rootScope.$apply();
      expect($ctrl.error).to.be.equal("err");
    });

    it("does lookup", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      sinon.stub($ctrl.Geocoding, "lookupAddress");
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect($ctrl.Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {} });
      $ctrl.trySetLocation();
      expect($ctrl.data.address).to.be.undefined;
    });

    it("resets coords if text is empty", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.data = { latitude: 30 };
      $ctrl.updateOrDeleteIfEmpty();
      expect($ctrl.data.latitude).to.be.null;
    });

    it("does not replace reference to marker", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {} });
      $ctrl.marker = { p: { lat: 12.34 } };
      let leafletMarker = $ctrl.marker.p;
      expect(leafletMarker.lat).to.equal(12.34);
      $ctrl.trySetLocation({
        address: "a", latitude: 99.99, longitude: 88.88
      });
      expect(leafletMarker.lat).to.equal(99.99);
    });
  });

  describe("directive", () => {
    let scope, $componentController, el, GroupService, $q, ngModel;

    beforeEach(() => {
      inject(($injector, $rootScope, $compile) => {
        scope = $rootScope.$new();
        $componentController = $injector.get("$componentController");
        scope.$ctrl = $componentController("groupEditCreateForm", {}, {
          data: {
            id: 1
          }
        });
        $q = $injector.get("$q");
        GroupService = $injector.get("GroupService");
        el = angular.element(
          "<input type='text' name='name' ng-model='$ctrl.data.name' groupname-Validator/>"
        );
        $compile(el)(scope);
      });
      ngModel = el.controller("ngModel");
    });

    it("should reject if group name already exists", () => {
      sinon.stub(GroupService, "listByGroupName").returns($q((resolve) => {
        resolve([{ id: 2 }]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(GroupService.listByGroupName).to.have.been.calledWith("testname");
      expect(ngModel.$valid).to.be.false;
    });

    it("should allow if group name does not exist", () => {
      sinon.stub(GroupService, "listByGroupName").returns($q((resolve) => {
        resolve([]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(GroupService.listByGroupName).to.have.been.calledWith("testname");
      expect(ngModel.$valid).to.be.true;
    });

    it("should allow the same group name if the returned value is the same group", () => {
      //this will occur when the user is editing the name of the group
      sinon.stub(GroupService, "listByGroupName").returns($q((resolve) => {
        resolve([{ id: 1 }]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(GroupService.listByGroupName).to.have.been.calledWith("testname");
      expect(ngModel.$valid).to.be.true;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group-edit-create-form></group-edit-create-form>")(scope);
    });
  });
});
