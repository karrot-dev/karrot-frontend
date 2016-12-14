import logo from "./carrot-logo.svgimage";

class TopbarController {
  constructor(Authentication) {
    "ngInject";
    Object.assign(this, {
      logo,
      Authentication
    });
  }

  $onInit() {
    this.Authentication.update().then((data) => {
      this.loggedInUser = data;
    });
  }
}

export default TopbarController;
