import ConversationsModule from "./conversations";

const { module } = angular.mock;

describe("Conversations", () => {
  beforeEach(module(Authentication));
  beforeEach(module(ConversationsModule));

  describe("Module", () => {
    it("is named conversations", () => {
      expect(ConversationsModule).to.equal("conversations");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("conversations", {});
      expect($ctrl).to.exist;
    });
  });
});
