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

  verify(userEmail) {
    return this.$http.post("/api/users/resend_verification/", { email: userEmail })
      .then((res) => res.data)
      .then(() => this.data = "Email Sent");
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {})
      .then(() => this.data = undefined);
  }
}

export default AuthenticationService;
