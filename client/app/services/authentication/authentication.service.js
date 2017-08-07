class AuthenticationService {

  constructor($http, $q, SessionUser) {
    "ngInject";
    this.$http = $http;
    this.$q = $q;
    this.SessionUser = SessionUser;
  }

  login(email, password) {
    return this.$http.post("/api/auth/", { email, password })
      .then((res) => res.data)
      .then((data) => this.SessionUser.set(data))
      .catch((res) => {
        this.SessionUser.clear();
        return this.$q.reject(res.data);
      });
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((res) => res.data)
      .then((data) => this.SessionUser.set(data))
      .catch((res) => {
        this.SessionUser.clear();
        return this.$q.reject(res.data);
      });
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {})
      .then(() => this.SessionUser.clear());
  }
}

export default AuthenticationService;
