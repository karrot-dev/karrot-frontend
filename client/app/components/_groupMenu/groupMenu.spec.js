import GroupMenuModule from "./groupMenu";
import GroupMenuController from "./groupMenu.controller";
import GroupMenuComponent from "./groupMenu.component";
import GroupMenuTemplate from "./groupMenu.html";

const { module } = angular.mock;

describe("GroupMenu", () => {
  beforeEach(module(GroupMenuModule));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named groupMenu", () => {
      expect(GroupMenuModule).to.equal("groupMenu");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("groupMenu", {});
      expect(ctrl).to.exist;
    });
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it("has name in template [REMOVE]", () => {
      expect(GroupMenuTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe("Component", () => {
    // component/directive specs
    let component = GroupMenuComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(GroupMenuTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(GroupMenuController);
    });
  });
});
