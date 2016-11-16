import <%= upCaseName %>Module from "./<%= name %>";

const { module } = angular.mock;

describe("<%= upCaseName %>", () => {
  beforeEach(module(<%= upCaseName %>Module));

  describe("Module", () => {
    it("is named <%= name %>", () => {
      expect(<%= upCaseName %>Module).to.equal("<%= name %>");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("<%= name %>", {});
      expect($ctrl).to.exist;
    });
  });
});
