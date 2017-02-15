import MarkdownInputModule from "./markdownInput";

const { module } = angular.mock;

describe("MarkdownInput", () => {
  beforeEach(module(MarkdownInputModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named markdownInput", () => {
      expect(MarkdownInputModule).to.equal("markdownInput");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("markdownInput", {});
      expect($ctrl).to.exist;
    });
  });
});
