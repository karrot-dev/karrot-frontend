import ExpandablePanelModule from "./expandablePanel";

const { module } = angular.mock;

describe("ExpandablePanel", () => {
  beforeEach(module(ExpandablePanelModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named expandablePanel", () => {
      expect(ExpandablePanelModule).to.equal("expandablePanel");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("renders markdown", () => {
      let $ctrl = $componentController("expandablePanel", { }, { markdown: true });
      $ctrl.$onChanges({
        content: {
          currentValue: "sometext"
        }
      });
      expect($ctrl.parsed).to.equal("<p>sometext</p>\n");
    });

    it("collapses long text", () => {
      let $ctrl = $componentController("expandablePanel", { });
      $ctrl.$onChanges({
        content: {
          currentValue: new Array(20).join("text\n")
        }
      });
      expect($ctrl.collapsed).to.be.true;
    });
  });
});
