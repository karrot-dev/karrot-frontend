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

  it("can be set", () => {
    let newList = [{ id: 5, name: "my store" }];
    CurrentStores.set(newList);
    expect(CurrentStores.list).to.deep.equal(newList);
  });

  it("selected can be set", () => {
    let newstore = { id: 5, name: "my store" };
    CurrentStores.setSelected(newstore);
    expect(CurrentStores.selected).to.deep.equal(newstore);
  });

  it("can be pushed", () => {
    let item = { id: 6, name: "my new store" };
    CurrentStores.pushItem(item);
    expect(CurrentStores.list).to.deep.equal([item]);
  });

  it("can be replaced", () => {
    CurrentStores.set([{ id: 6, name: "my new store" }]);
    let item = { id: 6, name: "changed the name" };
    CurrentStores.replaceItem(item);
    expect(CurrentStores.list).to.deep.equal([item]);
  });

  it("can be cleared", () => {
    CurrentStores.set([{ some: "data" }]);
    CurrentStores.clear();
    expect(CurrentStores.list).to.deep.equal([]);
  });

  it("copies properties from stores during set", () => {
    let list = CurrentStores.list;
    CurrentStores.set([{ some: "data" }]);
    expect(CurrentStores.list).to.equal(list);
  });

  it("gets store by id", () => {
    CurrentStores.list = [{ id: 42 }];
    expect(CurrentStores.get(42)).to.deep.equal({ id: 42 });
  });


});
