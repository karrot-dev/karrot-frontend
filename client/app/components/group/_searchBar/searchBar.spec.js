import SearchBarModule from "./searchBar";

const { module } = angular.mock;

describe("SearchBar", () => {
  beforeEach(module(SearchBarModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named searchBar", () => {
      expect(SearchBarModule).to.equal("searchBar");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("searchBar", {});
      expect($ctrl).to.exist;
    });

    it("toggels Search", () => {
      let $ctrl = $componentController("searchBar", {});
      $ctrl.toggleSearch();
      expect($ctrl.showSearch).to.be.true;
    });

    it("searchEntryDone hides searchBar when empty", () => {
      let $ctrl = $componentController("searchBar", {});
      $ctrl.toggleSearch();
      $ctrl.searchQuery = "test";
      $ctrl.searchEntryDone();
      expect($ctrl.showSearch).to.be.true;
      $ctrl.searchQuery = "";
      $ctrl.searchEntryDone();
      expect($ctrl.showSearch).to.be.false;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<search-bar></search-bar>")(scope);
    });
  });
});
