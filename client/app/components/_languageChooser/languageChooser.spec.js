import LanguageChooserModule from "./languageChooser";

const { module } = angular.mock;

describe("LanguageChooser", () => {
  beforeEach(module(LanguageChooserModule));

  describe("Module", () => {
    it("is named languageChooser", () => {
      expect(LanguageChooserModule).to.equal("languageChooser");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("languageChooser", {});
      expect(ctrl).to.exist;
    });
  });
});
