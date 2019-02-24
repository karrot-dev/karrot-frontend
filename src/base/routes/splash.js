const Login = () => import('@/authuser/pages/Login')
const LoginTitle = () => import('@/authuser/components/LoginTitle')
const VerifyMailTitle = () => import('@/authuser/components/VerifyMailTitle')
const RequestPasswordResetTitle = () => import('@/authuser/components/RequestPasswordResetTitle')
const RequestPasswordReset = () => import('@/authuser/pages/RequestReset')
const PasswordResetTitle = () => import('@/authuser/components/PasswordResetTitle')
const PasswordReset = () => import('@/authuser/pages/Reset')
const RequestPasswordResetSuccess = () => import('@/authuser/pages/RequestResetSuccess')
const Signup = () => import('@/authuser/pages/Signup')
const SignupTitle = () => import('@/authuser/components/SignupTitle')
const VerifyMail = () => import('@/authuser/pages/VerifyMail')
const DeleteAccount = () => import('@/authuser/pages/DeleteAccount')
const DeleteAccountTitle = () => import('@/authuser/components/Settings/DeleteAccountTitle')
const ApplicationForm = () => import('@/applications/pages/ApplicationForm')
const ApplicationFormTitle = () => import('@/applications/components/ApplicationFormTitle')
const Unsubscribe = () => import('@/unsubscribe/pages/Unsubscribe')
const UnsubscribeTitle = () => import('@/unsubscribe/components/UnsubscribeTitle')

export default [
  {
    name: 'login',
    path: '/login',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'LOGIN.TITLE', route: { name: 'login' } },
      ],
      afterLeave: 'auth/clearLoginStatus',
    },
    components: {
      default: Login,
      header: LoginTitle,
    },
  },
  {
    name: 'requestPasswordReset',
    path: '/password/request-reset',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'PASSWORDRESET.TITLE' },
      ],
    },
    components: {
      default: RequestPasswordReset,
      header: RequestPasswordResetTitle,
    },
  },
  {
    name: 'passwordReset',
    path: '/password/reset',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'PASSWORD.RESET.TITLE' },
      ],
    },
    components: {
      default: PasswordReset,
      header: PasswordResetTitle,
    },
  },
  {
    name: 'requestPasswordResetSuccess',
    path: '/password/request-reset/success',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'PASSWORD.RESET.TITLE' },
      ],
    },
    components: {
      default: RequestPasswordResetSuccess,
      header: PasswordResetTitle,
    },
  },
  {
    name: 'verifymail',
    path: '/email/verify',
    meta: {
      requireLoggedIn: false,
      breadcrumbs: [
        { translation: 'VERIFYMAIL.TITLE', route: { name: 'verifymail' } },
      ],
      afterLeave: 'verifymail/clear',
    },
    components: {
      default: VerifyMail,
      header: VerifyMailTitle,
    },
  },
  {
    name: 'signup',
    path: '/signup',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'SIGNUP.TITLE', route: { name: 'signup' } },
      ],
      afterLeave: 'users/clearSignup',
    },
    components: {
      default: Signup,
      header: SignupTitle,
    },
  },
  {
    name: 'deleteAccount',
    path: '/delete-user',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'DELETEACCOUNT.TITLE' },
      ],
      afterLeave: 'deleteAccount/clear',
    },
    components: {
      default: DeleteAccount,
      header: DeleteAccountTitle,
    },
  },
  {
    name: 'applicationForm',
    path: 'groupPreview/:groupPreviewId/apply',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'APPLICATION.FORM_HEADER' },
      ],
      beforeEnter: 'groups/selectPreview',
      afterLeave: 'applications/clearGroupPreviewAndStatus',
    },
    components: {
      default: ApplicationForm,
      header: ApplicationFormTitle,
    },
  },
  {
    name: 'unsubscribe',
    path: 'unsubscribe/:token',
    components: {
      default: Unsubscribe,
      header: UnsubscribeTitle,
    },
  },
]
