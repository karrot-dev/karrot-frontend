import MessageModule from "./message";

const { module } = angular.mock;

describe("Message", () => {
  beforeEach(module(MessageModule));

  describe("Module", () => {
    it("is named message", () => {
      expect(MessageModule).to.equal("message");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("message", {});
      expect($ctrl).to.exist;
    });
  });
});
