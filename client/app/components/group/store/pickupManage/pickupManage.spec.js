import PickupManageModule from "./pickupManage";

const { module } = angular.mock;

describe("PickupManage", () => {
  beforeEach(module(PickupManageModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named pickupManage", () => {
      expect(PickupManageModule).to.equal("pickupManage");
    });
  });

  describe("Controller", () => {
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("initializes", () => {
      let $ctrl = $componentController("pickupManage", {});
      Object.assign($ctrl, {
        series: [{
          "rule": {
            freq: "WEEKLY",
            byDay: ["WE", "TH"]
          },
          "start_date": new Date("2017-02-25T19:00:00Z")
        },
        {
          "rule": {
            freq: "WEEKLY"
          },
          "start_date": new Date("2017-02-25T19:00:00Z") // Saturday
        }],
        pickups: []
      });
      $ctrl.$onInit();
      expect($ctrl.dayLookup.SU).to.equal(0);
      expect($ctrl.series[0].start_date.getDate()).to.equal(25);
      expect($ctrl.series[0].rule.byDay).to.deep.equal(["WE", "TH"]);
      expect($ctrl.series[1].rule.byDay).to.deep.equal(["SA"]);
    });


    it("filters pickups", () => {
      let $ctrl = $componentController("pickupManage", {});
      $ctrl.pickups = [{
        "date": new Date("2017-02-25T22:49:00Z")
      },{
        "date": new Date("2017-02-25T22:49:00Z"),
        "series": 5
      }];
      expect($ctrl.getSinglePickups()[0].series).to.be.undefined;
    });

    it("makes long day names", () => {
      let $ctrl = $componentController("pickupManage", {});
      expect($ctrl.getDayNames({
        rule: { byDay: ["SA", "TH"] }
      })).to.deep.equal(["Saturday", "Thursday"]);
    });

    it("edits pickup", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [], pickups: []
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve({ new: "data" }));
      let data = { old: "data" };
      $ctrl.openPanel({}, { data });
      $rootScope.$apply();
      expect(data.new).to.be.equal("data");
    });

    it("creates one-time pickup", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [], pickups: []
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve({ date: "something" }));
      $ctrl.openPanel({}, { series: false });
      $rootScope.$apply();
      expect($ctrl.pickups).to.deep.equal([{ date: "something" }]);
    });

    it("creates pickup series", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [], pickups: []
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve({ "start_date": "something" }));
      $ctrl.openPanel({}, { series: true });
      $rootScope.$apply();
      expect($ctrl.series).to.deep.equal([{ "start_date": "something" }]);
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<pickup-manage></pickup-manage>")(scope);
    });
  });
});
