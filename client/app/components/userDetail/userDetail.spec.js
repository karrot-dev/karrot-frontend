import UserDetailModule from "./userDetail";

const { module } = angular.mock;

describe("UserDetail", () => {
  beforeEach(module(UserDetailModule));

  describe("Module", () => {
    it("is named userDetail", () => {
      expect(UserDetailModule).to.equal("userDetail");
    });
  });
});
