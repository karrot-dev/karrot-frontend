import bananaImg from "./banana.png";
import cherryImg from "./cherry.png";
import cartImg from "./cart.png";

class LandingPageController {
  constructor($location, $anchorScroll) {
    "ngInject";
    Object.assign(this, {
      $location,
      $anchorScroll,
      bananaImg,
      cherryImg,
      cartImg
    });
  }
  
  goToMap(){
    this.$location.hash('map');
    this.$anchorScroll();
  }
}

export default LandingPageController;
