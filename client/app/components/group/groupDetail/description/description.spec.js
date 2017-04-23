import DescriptionModule from "./description";
import User from "../../../../services/user/user";

const { module } = angular.mock;

describe("Description", () => {
  beforeEach(module(DescriptionModule));
  beforeEach(module(User));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named description", () => {
      expect(DescriptionModule).to.equal("description");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("description", {});
      expect($ctrl).to.exist;
    });
  });
});
