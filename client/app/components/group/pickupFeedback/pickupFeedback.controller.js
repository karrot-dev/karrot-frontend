import cartImg from "./cart.png";
import bagImg from "./bag.png";
import milkImg from "./milk.png";
import flourImg from "./flour.png";
import flourGuyImg from "./flourGuy.png";
import appleImg from "./apple.png";
import appleGuyImg from "./appleGuy.png";

class PickupFeedbackController {
  constructor(ScreenSize, $stateParams, Feedback, CurrentUsers, CurrentStores, SessionUser, $http) {
    "ngInject";
    Object.assign(this, {
      cartImg,
      ScreenSize,
      Feedback,
      CurrentUsers,
      CurrentStores,
      SessionUser,
      $http,
      $stateParams,
      amountImages: [],
      data: {
        amount: 1,
        comment: ""
      },
      status: {},
      allFeedback: [],
      donePickups: [],
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

  $onInit() {
    // get ALL feedback
    // TODO: get only for group and paginate
    this.Feedback.list()
      .then((data) => this.allFeedback = data);


    // load done pickups
    // TODO: move into pickup service
    this.pickupsLoading = true;
    this.$http.get("/api/pickup-dates/", { params: { group: this.$stateParams.groupId, "date_1": new Date() } })
      .then((res) => res.data)
      .then((data) => this.donePickups = data)
      .finally(() => this.pickupsLoading = false);
  }

  getAvailablePickups() {
    // returns done pickups where the user has been a collector and hasn't given feedback yet
    return this.donePickups
      .filter((p) => p.collector_ids.includes(this.SessionUser.value.id))
      .filter((p) => {
        return this.allFeedback.findIndex((f) => f.about === p.id && f.given_by === this.SessionUser.value.id) < 0;
      });
  }

  getGroupFeedback() {
    // returns feedback of pickups in the group
    return this.allFeedback.filter((f) => this.donePickups.findIndex((p) => p.id === f.about) > -1);
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

  create() {
    const input = {
      about: this.$stateParams.pickupId,
      weight: this.data.amount,
      comment: this.data.comment
    };

    Object.assign(this.status, {
      creating: true,
      created: false,
      error: undefined,
      returned: undefined
    });

    this.Feedback.create(input)
    .then((data) => {
      Object.assign(this.status, {
        creating: false,
        created: true,
        returned: data
      });
    })
    .catch((err) => {
      Object.assign(this.status, {
        creating: false,
        created: false,
        error: err.data
      });
    });
  }
}

export default PickupFeedbackController;
