import LanguageChooserModule from "./languageChooser";

const { module } = angular.mock;

describe("LanguageChooser", () => {
  beforeEach(module(LanguageChooserModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named languageChooser", () => {
      expect(LanguageChooserModule).to.equal("languageChooser");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("changes language", () => {
      let $ctrl = $componentController("languageChooser", {});
      sinon.stub($ctrl.$translate, "use");
      $ctrl.changeLanguage("de");
      expect($ctrl.$translate.use).to.have.been.calledWith("de");
    });
  });
});
