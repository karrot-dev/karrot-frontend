import CreateGroupModule from "./createGroup";
import Authentication from "../../common/authentication/authentication";

const { module } = angular.mock;

describe("CreateGroup", () => {
  beforeEach(module(Authentication));
  beforeEach(module(CreateGroupModule));

  describe("Module", () => {
    it("is named createGroup", () => {
      expect(CreateGroupModule).to.equal("createGroup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let $ctrl = $componentController("createGroup", {});
      expect($ctrl).to.exist;
    });
  });
});
