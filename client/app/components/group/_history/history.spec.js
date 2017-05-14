import HistoryModule from "./history";

const { module } = angular.mock;

describe("History", () => {
  beforeEach(module(HistoryModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named history", () => {
      expect(HistoryModule).to.equal("history");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("builds translate key", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl.getTranslateKey({ typus: "GROUP_JOIN" })).to.deep.equal("HISTORY.GROUP_JOIN");
    });

    it("retrieves store name", () => {
      let $ctrl = $componentController("history", {});
      $ctrl.CurrentStores.set([{
        id: 5,
        name: "Joe's Store"
      }]);
      expect($ctrl.getTranslateValues({ store: 5 })).to.deep.equal({
        "store_name": "Joe's Store",
        name: "Joe's Store"
      });
    });


    it("checks if date header should be shown", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl.showDateHeaderBefore(0, [])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-10T11:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-11T12:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.false;
    });

    it("checks if there is more data", () => {
      let $ctrl = $componentController("history", {}, { data: {} });
      $ctrl.data.next = undefined;
      expect($ctrl.hasMore()).to.be.false;
      $ctrl.data.next = () => {};
      expect($ctrl.hasMore()).to.be.true;
    });

    it("loads more data", () => {
      let $ctrl = $componentController("history", {}, { data: {
        next: sinon.stub(),
        results: []
      } });
      inject(($q, $rootScope) => {
        $ctrl.data.next.returns($q.resolve({
          next: sinon.stub(),
          results: [{ id: 5 }]
        }));
        // $ctrl.data.next gets replaced
        let stub = $ctrl.data.next;
        $ctrl.loadMore();
        $rootScope.$apply();
        expect(stub).to.have.been.called;
        expect($ctrl.data.results).to.deep.equal([{ id: 5 }]);
        expect($ctrl.data.next).to.be.defined;

        $ctrl.data.next.returns($q.resolve({
          next: undefined,
          results: [{ id: 6 }]
        }));
        stub = $ctrl.data.next;
        $ctrl.loadMore();
        $rootScope.$apply();
        expect(stub).to.have.been.called;
        expect($ctrl.data.results).to.deep.equal([{ id: 5 }, { id: 6 }]);
        expect($ctrl.data.next).to.be.undefined;
      });
    });

    it("opens history detail dialog", () => {
      let $ctrl = $componentController("history", {});
      inject(($q, $rootScope) => {
        sinon.stub($ctrl.$mdDialog, "show");
        $ctrl.$mdDialog.show.returns($q.resolve());
        $ctrl.openHistoryDetail();
        $rootScope.$apply();
      });
      expect($ctrl.$mdDialog.show).to.have.been.called;
    });
  });
});
