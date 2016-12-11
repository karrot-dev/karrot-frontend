import ConversationModule from "./conversation";

const { module } = angular.mock;

describe("Conversation", () => {
  beforeEach(module(ConversationModule));

  describe("Module", () => {
    it("is named conversation", () => {
      expect(ConversationModule).to.equal("conversation");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("conversation", {});
      expect($ctrl).to.exist;
    });
  });
});
