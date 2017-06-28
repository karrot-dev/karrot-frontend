import pickupEditCreateModule from "./pickupEditCreate";

const { module } = angular.mock;

describe("pickupEditCreate", () => {
  let $componentController, $httpBackend;

  beforeEach(module(pickupEditCreateModule));
  beforeEach(module({ translateFilter: (a) => a }));
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
    let $ctrl, $q, $rootScope;

    beforeEach(inject(($injector) => {
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    let mockTime = (hour, minute) => {
      return {
        moment: {
          toDate: () => {
            return {
              getHours: () => {
                return hour;
              },
              getMinutes: () => {
                return minute;
              }
            };
          }
        }
      };
    };

    it("initializes", () => {
      $ctrl = $componentController("pickupEditCreate", {}, {
        data: {
          storeId: 2,
          series: true
        }
      });
      $ctrl.$onInit();
      expect($ctrl.days[2]).to.deep.equal({ key: "WE", name: "Wednesday" });

      // assumes that this test is run with the default "en" locale of moment.js
      expect($ctrl.timeLookup("8:00 PM").length).to.equal(1);
      expect($ctrl.timeLookup().length).to.equal(96);
    });

    it("creates one-time pickup", () => {
      $ctrl = $componentController("pickupEditCreate", {}, {
        data: {
          storeId: 2,
          series: false
        }
      });
      sinon.stub($ctrl.$mdDialog, "hide");
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.false;
      expect($ctrl.isCreate).to.be.true;
      $ctrl.singleData.date = new Date(2016,6,14);
      $ctrl.time = mockTime(15, 22);
      sinon.stub($ctrl.PickupDate, "create");
      $ctrl.PickupDate.create.returns($q.resolve());
      $ctrl.handleSubmit();
      $rootScope.$apply();
      expect($ctrl.PickupDate.create).to.have.been.calledWith({
        date: new Date(2016,6,14,15,22),
        "max_collectors": 2,
        store: 2
      });
      expect($ctrl.$mdDialog.hide).to.have.been.called;
    });

    it("creates regular pickup", () => {
      $ctrl = $componentController("pickupEditCreate", {
      }, {
        data: {
          storeId: 2,
          series: true
        }
      });
      sinon.stub($ctrl.$mdDialog, "hide");
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.true;
      expect($ctrl.isCreate).to.be.true;
      $ctrl.seriesData.rule.byDay = ["MO","TU"];
      $ctrl.time = mockTime(15, 22);
      sinon.stub($ctrl.PickupDateSeries, "create");
      $ctrl.PickupDateSeries.create.returns($q.resolve());
      $ctrl.handleSubmit();
      $rootScope.$apply();
      let date = angular.copy($ctrl.seriesData.start_date);
      date.setHours(15);
      date.setMinutes(22);
      expect($ctrl.PickupDateSeries.create).to.have.been.calledWith({
        "start_date": date,
        rule: {
          byDay: ["MO", "TU"],
          freq: "WEEKLY"
        },
        "max_collectors": 2,
        store: 2
      });
      expect($ctrl.$mdDialog.hide).to.have.been.called;
    });

    it("edits one-time pickup", () => {
      let date = new Date(2016,2,25,0,0);
      $ctrl = $componentController("pickupEditCreate", {}, {
        data: {
          storeId: 2,
          series: false,
          editData: {
            id: 67,
            date,
            "max_collectors": 5,
            store: 3
          }
        }
      });
      sinon.stub($ctrl.$mdDialog, "hide");
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.false;
      expect($ctrl.isCreate).to.be.false;
      $ctrl.time = mockTime(15, 22);
      sinon.stub($ctrl.PickupDate, "save");
      $ctrl.PickupDate.save.returns($q.resolve());
      $ctrl.handleSubmit();
      $rootScope.$apply();
      expect($ctrl.PickupDate.save).to.have.been.calledWith({
        id: 67,
        date: new Date(2016,2,25,15,22),
        store: 3,
        "max_collectors": 5
      });
      expect($ctrl.$mdDialog.hide).to.have.been.called;
    });

    it("edits regular pickup", () => {
      $ctrl = $componentController("pickupEditCreate", {
      }, {
        data: {
          storeId: 2,
          series: true,
          editData: {
            id: 67,
            "start_date": new Date(2016,2,25,0,0),
            "max_collectors": 6,
            rule: {
              byDay: ["MO"]
            },
            store: 3
          }
        }
      });
      sinon.stub($ctrl.$mdDialog, "hide");
      $ctrl.$onInit();
      expect($ctrl.isSeries).to.be.true;
      expect($ctrl.isCreate).to.be.false;
      $ctrl.seriesData.rule.byDay = ["MO","TU"];
      $ctrl.time = mockTime(15, 22);
      sinon.stub($ctrl.PickupDateSeries, "save");
      $ctrl.PickupDateSeries.save.returns($q.resolve());
      $ctrl.handleSubmit();
      $rootScope.$apply();
      expect($ctrl.PickupDateSeries.save).to.have.been.calledWith({
        id: 67,
        "start_date": new Date(2016,2,25,15,22),
        "max_collectors": 6,
        rule: {
          byDay: ["MO", "TU"]
        },
        store: 3
      });
      expect($ctrl.$mdDialog.hide).to.have.been.called;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      scope.data = {
        "series": true
      };
      $compile("<pickup-edit-create data='data'></pickup-edit-create>")(scope);
      scope.$digest();
    });
  });
});
