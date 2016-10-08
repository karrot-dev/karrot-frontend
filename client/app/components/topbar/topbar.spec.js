import TopbarModule from "./topbar";
import TopbarController from "./topbar.controller";
import TopbarComponent from "./topbar.component";
import TopbarTemplate from "./topbar.html";

describe("Topbar", () => {
  let makeController;

  beforeEach(window.module(TopbarModule));
  beforeEach(inject(() => {
    makeController = () => {
      return new TopbarController();
    };
  }));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    // controller specs
    it("has a name property [REMOVE]", () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property("name");
    });
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it("has name in template [REMOVE]", () => {
      expect(TopbarTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
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
