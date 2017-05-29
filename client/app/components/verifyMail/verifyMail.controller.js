class VerifyMailController {
  mailIsDifferent(user) {
    return angular.isDefined(user.unverified_email)
      && user.unverified_email !== null
      && user.email !== user.unverified_email;
  }
}

export default VerifyMailController;
