import base from '../base/service';

class UserService extends base {

  constructor($http) {
    'ngInject';
    super();
    this.$http=$http;
  }

  users() {
    return this.$http.get('/api/users/').then(res => res.data);
  }

  create(user) {
    if (UserService.validate(["email", "password", "display_name"])) {
      return this.$http.post('/api/users/', user).then(res => res.data);
    } else {
      return Promise.reject();
    }
  }

  get(pk) {
    pk=UserService.resolvePrivateKey(pk);
    if(!pk)
      return Promise.reject();

    return this.$http.get(`/api/users/${pk}/`).then(res => res.data).then((user) => {
      if(UserService.validate(user)) {
        return Promise.resolve(user);
      } else {
        return Promise.reject();
      }
    });
  }

  save(id, updates) {
    if(UserService.validate(["id"])) {
      return this.$http.patch(`/api/users/${id}/`, updates).then(res => res.data);
    } else {
      return Promise.reject();
    }
  }

  delete(pk) {
    pk=UserService.resolvePrivateKey(pk);
    if(pk) {
      return this.$http.delete(`/api/users/${pk}/`);
    } else {
      return Promise.reject();
    }
  }
}

export default UserService;
