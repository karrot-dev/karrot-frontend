import StoreModule from "./store";

const { module } = angular.mock;

describe("CurrentStores service", () => {
  beforeEach(module(StoreModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let CurrentStores;

  beforeEach(inject(($injector) => {
    CurrentStores = $injector.get("CurrentStores");
  }));

  it("starts with an empty empty", () => {
    expect(CurrentStores.list).to.deep.equal([]);
  });

  it("can be set and gets sorted", () => {
    let newList = [{ id: 5, name: "my store" }, { id: 6, name: "a store" }];
    CurrentStores.set(newList);
    expect(CurrentStores.list).to.deep.equal([
      { id: 6, name: "a store" },
      { id: 5, name: "my store" }
    ]);
  });

  it("selected can be set", () => {
    let newstore = { id: 5, name: "my store" };
    CurrentStores.setSelected(newstore);
    expect(CurrentStores.selected).to.deep.equal(newstore);
  });

  it("can be pushed and gets sorted", () => {
    CurrentStores.list = [{ id: 99, name: "a store" }];
    let item = { id: 6, name: "my new store" };
    CurrentStores.pushItem(item);
    expect(CurrentStores.list).to.deep.equal([
      { id: 99, name: "a store" },
      { id: 6, name: "my new store" }
    ]);
  });

  it("can be replaced and gets sorted", () => {
    CurrentStores.list = [{ id: 99, name: "a store" }, { id: 6, name: "my new store" }];
    let item = { id: 6, name: "changed the name" };
    CurrentStores.replaceItem(item);
    expect(CurrentStores.list).to.deep.equal([
      { id: 99, name: "a store" },
      { id: 6, name: "changed the name" }
    ]);
  });

  it("can be cleared", () => {
    CurrentStores.list = [{ name: "data" }];
    CurrentStores.clear();
    expect(CurrentStores.list).to.deep.equal([]);
  });

  it("copies properties from stores during set", () => {
    let list = CurrentStores.list;
    CurrentStores.set([{ name: "data" }]);
    expect(CurrentStores.list).to.equal(list);
  });

  it("gets store by id", () => {
    CurrentStores.list = [{ id: 42 }];
    expect(CurrentStores.get(42)).to.deep.equal({ id: 42 });
  });
});
