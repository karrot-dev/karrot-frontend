class AuthenticationService {

  constructor($http, $q) {
    "ngInject";
    this.$http = $http;
    this.$q = $q;
    this.data = undefined;
  }

  login(email, password) {
    return this.$http.post("/api/auth/", { email, password })
      .then((res) => res.data)
      .then((data) => this.data = data)
      .catch((res) => this.$q.reject(res.data));
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((res) => res.data)
      .then((data) => this.data = data)
      .catch((res) => this.$q.reject(res.data));
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {})
      .then(() => this.data = undefined);
  }
}

export default AuthenticationService;
