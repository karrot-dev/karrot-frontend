import cartImg from "./cart.png";
import bagImg from "./bag.png";
import milkImg from "./milk.png";
import flourImg from "./flour.png";
import flourGuyImg from "./flourGuy.png";
import appleImg from "./apple.png";
import appleGuyImg from "./appleGuy.png";

class PickupFeedbackController {
  constructor($mdMedia) {
    "ngInject";
    Object.assign(this, {
      cartImg,
      $mdMedia,
      amountImages: [],
      data: {
        amount: 0,
        comment: ""
      }
    });
  }

  isHigherImg(data){
    return data === bagImg;
  }

  setFeedbackImages(){ // eslint-disable-line
    this.amountImages = [];
    let amount = this.data.amount;
    while (amount >= 0.15){
      if (amount >= 6.0) {
        this.amountImages.push(bagImg);
        amount -= 6.0;
        continue;
      }
      if (amount >= 1.0 && Math.random() < 0.7) {
        this.amountImages.push(milkImg);
        amount -= 1.0;
        continue;
      }
      if (amount >= 0.5 && Math.random() < 0.9) {
        if (Math.random() > 0.9) {
          this.amountImages.push(flourGuyImg);
        } else {
          this.amountImages.push(flourImg);
        }
        amount -= 0.5;
        continue;
      }
      if (Math.random() > 0.9) {
        this.amountImages.push(appleGuyImg);
      } else {
        this.amountImages.push(appleImg);
      }
      amount -= 0.15;
    }
    return amount;
  }
}

export default PickupFeedbackController;
