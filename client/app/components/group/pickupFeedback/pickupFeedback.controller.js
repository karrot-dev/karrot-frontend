import cartImg from "./cart.png";

class PickupFeedbackController {
  constructor($mdMedia) {
    "ngInject";
    Object.assign(this, {
      cartImg,
      $mdMedia,
      data: {
        amount: 0,
        comment: ""
      }
    });
  }
}

export default PickupFeedbackController;
