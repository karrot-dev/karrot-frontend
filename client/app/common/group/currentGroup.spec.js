import GroupModule from "./group";

const { module } = angular.mock;

describe("CurrentGroup service", () => {
  beforeEach(module(GroupModule));

  let CurrentGroup;

  beforeEach(inject(($injector) => {
    CurrentGroup = $injector.get("CurrentGroup");
  }));

  it("starts with an empty empty", () => {
    expect(CurrentGroup.value).to.deep.equal({});
  });

  it("can be set", () => {
    let newGroup = {
      anything: "can",
      go: "here",
      including: ["lists", "of", "stuff"]
    };
    CurrentGroup.set(newGroup);
    expect(CurrentGroup.value).to.deep.equal(newGroup);
  });

  it("can be cleared", () => {
    CurrentGroup.set({ some: "data" });
    CurrentGroup.clear();
    expect(CurrentGroup.value).to.deep.equal({});
  });

  it("copies properties from group during set", () => {
    let value = CurrentGroup.value;
    CurrentGroup.set({ some: "data" });
    expect(CurrentGroup.value).to.equal(value);
  });

});
