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
      },
      images: {
        bag: bagImg,
        milk: milkImg,
        flour: flourImg,
        flourGuy: flourGuyImg,
        apple: appleImg,
        appleGuy: appleGuyImg
      }
    });
  }

  isHigherImg(data){
    return data === this.images.bag;
  }

  setFeedbackImages(){ // eslint-disable-line
    this.amountImages = [];
    let amount = this.data.amount;
    while (amount >= 0.15){
      if (amount >= 6.0) {
        this.amountImages.push(this.images.bag);
        amount -= 6.0;
        continue;
      }
      if (amount >= 1.0 && Math.random() < 0.7) {
        this.amountImages.push(this.images.milk);
        amount -= 1.0;
        continue;
      }
      if (amount >= 0.5 && Math.random() < 0.9) {
        if (Math.random() > 0.9) {
          this.amountImages.push(this.images.flourGuy);
        } else {
          this.amountImages.push(this.images.flour);
        }
        amount -= 0.5;
        continue;
      }
      if (Math.random() > 0.9) {
        this.amountImages.push(this.images.appleGuy);
      } else {
        this.amountImages.push(this.images.apple);
      }
      amount -= 0.15;
    }
    return amount;
  }
}

export default PickupFeedbackController;
