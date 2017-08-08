class AuthenticationService {

  constructor($http, $q, SessionUser, $cacheFactory) {
    "ngInject";
    this.$http = $http;
    this.$q = $q;
    this.SessionUser = SessionUser;
    this.cache = $cacheFactory("AuthenticationService");
  }

  login(email, password) {
    return this.$http.post("/api/auth/", { email, password })
      .then((res) => {
        this.SessionUser.set(res.data);
        this.cache.removeAll();
        return res.data;
      });
  }

  update() {
    return this.$http.get("/api/auth/status/", { cache: this.cache })
      .then((res) => res.data)
      .then((user) => this.SessionUser.set(user))
      .catch((e) => {
        this.SessionUser.clear();
        return this.$q.reject(e.data);
      });
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {})
      .then((v) => {
        this.SessionUser.clear();
        this.cache.removeAll();
        return this.$q.resolve(v);
      });
  }
}

export default AuthenticationService;
