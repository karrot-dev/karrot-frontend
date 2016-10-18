import GroupDetailController from "./groupDetail.controller";
import GroupDetailComponent from "./groupDetail.component";
import GroupDetailTemplate from "./groupDetail.html";

describe("GroupDetail", () => {
  
  describe("Component", () => {
    let component = GroupDetailComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(GroupDetailTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(GroupDetailController);
    });
  });
});
