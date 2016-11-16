import JoinGroupModule from "./joinGroup";
import JoinGroupController from "./joinGroup.controller";
import JoinGroupComponent from "./joinGroup.component";
import JoinGroupTemplate from "./joinGroup.html";

const { module } = angular.mock;

describe("JoinGroup", () => {
  beforeEach(module(JoinGroupModule));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named joinGroup", () => {
      expect(JoinGroupModule).to.equal("joinGroup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let $ctrl = $componentController("joinGroup", {});
      expect($ctrl).to.exist;
    });

    it("joins group", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.joinGroup();
      // TODO assert something
    });
  });

  describe("Component", () => {
    // component/directive specs
    let component = JoinGroupComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(JoinGroupTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(JoinGroupController);
    });
  });
});
