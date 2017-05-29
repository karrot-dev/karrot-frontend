class VerifyMailController {
  mailIsDifferent(user) {
    if (angular.isString(user.unverified_email)) {
      return user.email !== user.unverified_email;
    }
    return false;
  }
}

export default VerifyMailController;
