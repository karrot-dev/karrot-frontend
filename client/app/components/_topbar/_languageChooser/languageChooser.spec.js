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

    it("should exist", () => {
      let $ctrl = $componentController("languageChooser", {});
      expect($ctrl).to.exist;
    });

    context("stubbed translate", () => {
      let $translate;
      beforeEach(inject(($injector) => {
        $componentController = $injector.get("$componentController");
        $translate = $injector.get("$translate");
        sinon.stub($translate, "use");
      }));

      it("calls use method", () => {
        let $ctrl = $componentController("languageChooser", {});
        $ctrl.changeLanguage("de");
        expect($translate.use).to.have.been.calledWith("de");
      });
    });

  });
});
