import TopbarModule from "./topbar";
import TopbarController from "./topbar.controller";
import TopbarComponent from "./topbar.component";
import TopbarTemplate from "./topbar.html";

const { module } = angular.mock;

describe("Topbar", () => {
  let makeController;

  beforeEach(module(TopbarModule));
  beforeEach(inject(() => {
    makeController = () => {
      return new TopbarController();
    };
  }));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    it("has name topbar", () => {
      let controller = makeController();
      expect(controller.name).to.equal("topbar");
    });
  });

  describe("Component", () => {
      // component/directive specs
    let component = TopbarComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(TopbarTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(TopbarController);
    });
  });
});
