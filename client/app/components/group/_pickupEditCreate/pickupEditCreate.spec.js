import pickupEditCreateModule from "./pickupEditCreate";
import pickupEditCreateController from "./pickupEditCreate.controller";
import pickupEditCreateComponent from "./pickupEditCreate.component";
import pickupEditCreateTemplate from "./pickupEditCreate.html";

const { module } = angular.mock;

describe("pickupEditCreate", () => {
  let $componentController, $httpBackend;

  beforeEach(module(pickupEditCreateModule));
  beforeEach(() => {
    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {
        hide: () => {}
      });
    });
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $componentController = $injector.get("$componentController");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named pickupEditCreate", () => {
      expect(pickupEditCreateModule).to.equal("pickupEditCreate");
    });
  });

  describe("Controller", () => {
    let $ctrl, PickupDate, PickupDateSeries, $q, $rootScope;

    beforeEach(inject(($injector) => {
      PickupDate = $injector.get("PickupDate");
      PickupDateSeries = $injector.get("PickupDateSeries");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
      sinon.stub(PickupDate, "create");
      sinon.stub(PickupDate, "save");
      sinon.stub(PickupDateSeries, "create");
      sinon.stub(PickupDateSeries, "save");
    }));

    it("creates one-time pickup", () => {
      $ctrl = $componentController("pickupEditCreate", {
      }, {
        data: {
          storeId: 2,
          series: false
        }
      });
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.false;
      $ctrl.pickupData = {
        date: new Date(2016,6,14),
        time: {
          getHours: () => {
            return 15;
          },
          getMinutes: () => {
            return 22;
          }
        },
        max_collectors: 5 //eslint-disable-line
      };
      PickupDate.create.withArgs().returns($q.resolve());
      $ctrl.handleSubmit();
      $rootScope.$apply();
    });

    it("initializes", () => {
      $ctrl = $componentController("pickupEditCreate", {
      }, {
        data: {
          storeId: 2,
          series: true
        }
      });
      $ctrl.$onInit();
      expect($ctrl.days[2]).to.deep.equal({ key: "WE", name: "Wednesday" });
    });

    it("creates regular pickup", () => {
      $ctrl = $componentController("pickupEditCreate", {
      }, {
        data: {
          storeId: 2,
          series: true
        }
      });
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.true;
      Object.assign($ctrl.pickupData, {
        time: {
          getHours: () => {
            return 15;
          },
          getMinutes: () => {
            return 22;
          }
        },
        max_collectors: 5, //eslint-disable-line
        rule: {
          byDay: ["MO","TU"]
        }
      });
      PickupDateSeries.create.withArgs().returns($q.resolve());
      $ctrl.handleSubmit();
    });
  });

  describe("Component", () => {
    // component/directive specs
    let component = pickupEditCreateComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(pickupEditCreateTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(pickupEditCreateController);
    });
  });
});
