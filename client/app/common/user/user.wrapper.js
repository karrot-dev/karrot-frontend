import angular from 'angular';
import base from '../base/service';

class UserService extends base {

  static properties () {
    return [];
  }

  constructor(UserCommunication) {
    'ngInject';
    super();
    this.UserCom=UserCommunication;
    this.users=[];
  }

  users(search) {
    return this.UserCom.users(search);
  }

  create(user) {
    if(UserService.validate(["email", "password", "display_name"])) {
      return this.UserCom.create(user);
    } else {
      return Promise.reject();
    }
  }

  get(pk) {
    pk=UserService.resolvePrivateKey(pk);
    if(!pk)
      return Promise.reject();

    return this.UserCom.get(pk).then((user) => {
      if(UserService.validate(user)) {
        return Promise.resolve(user);
      } else {
        return Promise.reject();
      }
    }, () => {
      return Promise.reject();
    });
  }

  save(user) {
    if(UserService.validate(["pk"]))
      return this.UserCom.save(user);
    else
      return Promise.reject();
  }

  delete(pk) {
    pk=UserService.resolvePrivateKey(pk);
    if(pk)
      return this.UserCom.delete(pk);
    else
      return Promise.reject();
  }

}

export default UserService;
