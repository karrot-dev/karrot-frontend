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
      let $ctrl = $componentController("pickupManage", {}, {
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

    it("sorts lists", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [
          { id: 2, "start_date": new Date("2017-02-25T20:00:00Z") },
          { id: 1, "start_date": new Date("2017-02-26T10:00:00Z") }
        ],
        pickups: [
          { id: 2, date: new Date("2017-02-26T10:00:00Z") },
          { id: 1, date: new Date("2017-02-25T20:00:00Z") }
        ]
      });
      $ctrl.sortLists();
      expect($ctrl.series[0].id).to.equal(1);
      expect($ctrl.pickups[0].id).to.equal(1);
    });

    it("filters pickups", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        pickups: [{
          "date": new Date("2017-02-25T22:49:00Z")
        },{
          "date": new Date("2017-02-25T22:49:00Z"),
          series: 5
        }]
      });
      expect($ctrl.getSinglePickups()[0].series).to.be.undefined;
      expect($ctrl.getPickupsInSeries({ id: 5 })[0].series).to.equal(5);
    });

    it("checks status", () => {
      let $ctrl = $componentController("pickupManage", {});
      expect($ctrl.hasSameTime({
        "start_date": new Date("2017-02-25T22:49:00Z")
      }, {
        date: new Date("2017-02-28T22:49:00Z")
      })).to.be.true;

      expect($ctrl.hasSameTime({
        "start_date": new Date("2017-02-25T22:49:00Z")
      }, {
        date: new Date("2017-02-28T22:50:00Z")
      })).to.be.false;

      expect($ctrl.hasSameMaxCollectors({
        "max_collectors": 5
      }, {
        "max_collectors": 5
      })).to.be.true;

      expect($ctrl.hasSameMaxCollectors({
        "max_collectors": 5
      }, {
        "max_collectors": 6
      })).to.be.false;

      expect($ctrl.hasSameMaxCollectors({}, {})).to.be.true;
      expect($ctrl.hasSameMaxCollectors({}, { "max_collectors": 6 })).to.be.false;

      expect($ctrl.hasCollectors({ "collector_ids": [] })).to.be.false;
      expect($ctrl.hasCollectors({ "collector_ids": [9, 7] })).to.be.true;
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
      $ctrl.$mdDialog.show.returns($q.resolve({ new: "data", date: "date" }));
      let data = { old: "data" };
      $ctrl.openEditCreatePanel({}, { data });
      $rootScope.$apply();
      expect(data.new).to.be.equal("data");
    });

    it("creates one-time pickup", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [], pickups: []
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve({ date: "something" }));
      $ctrl.openEditCreatePanel({}, { series: false });
      $rootScope.$apply();
      expect($ctrl.pickups).to.deep.equal([{ date: "something" }]);
    });

    it("creates pickup series", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [], pickups: []
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve({ "start_date": "something", id: 5 }));
      sinon.stub($ctrl.PickupDate, "listBySeriesId");
      $ctrl.PickupDate.listBySeriesId.returns($q.resolve([{ id: 6 }]));
      $ctrl.openEditCreatePanel({}, { series: true });
      $rootScope.$apply();
      expect($ctrl.series).to.deep.equal([{ "start_date": "something", id: 5, $expanded: true }]);
      expect($ctrl.pickups).to.deep.equal([{ id: 6 }]);
      expect($ctrl.PickupDate.listBySeriesId).to.have.been.calledWith(5);
    });

    it("cancels editCreate dialog", () => {
      let $ctrl = $componentController("pickupManage", {});
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.reject());
      $ctrl.openEditCreatePanel({}, {});
      $rootScope.$apply();
    });

    it("toggles series", () => {
      let $ctrl = $componentController("pickupManage", {});
      let series = { $expanded: false };
      $ctrl.toggle(series);
      expect(series.$expanded).to.be.true;
    });

    it("deletes pickup", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        pickups: [{ id: 7 }]
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve());
      sinon.stub($ctrl.PickupDate, "delete");
      $ctrl.PickupDate.delete.returns($q.resolve());
      $ctrl.openDeletePanel({}, { data: { id: 7 }, series: false });
      $rootScope.$apply();
      expect($ctrl.pickups).to.deep.equal([]);
    });

    it("deletes series", () => {
      let $ctrl = $componentController("pickupManage", {}, {
        series: [{ id: 7 }],
        pickups: [{ series: 7 }]
      });
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve());
      sinon.stub($ctrl.PickupDateSeries, "delete");
      $ctrl.PickupDateSeries.delete.returns($q.resolve());
      $ctrl.openDeletePanel({}, { data: { id: 7 }, series: true });
      $rootScope.$apply();
      expect($ctrl.pickups).to.deep.equal([]);
      expect($ctrl.series).to.deep.equal([]);
    });

    it("cancels delete dialog", () => {
      let $ctrl = $componentController("pickupManage", {});
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.reject());
      $ctrl.openDeletePanel({}, {});
      $rootScope.$apply();
    });
  });
});
