const Login = () => import('@/pages/Login')
const LoginTitle = () => import('@/components/Login/LoginTitle')
const VerifyMailTitle = () => import('@/components/Login/VerifyMailTitle')
const RequestPasswordResetTitle = () => import('@/components/Login/RequestPasswordResetTitle')
const RequestPasswordReset = () => import('@/pages/Password/RequestReset')
const PasswordResetTitle = () => import('@/components/Login/PasswordResetTitle')
const PasswordReset = () => import('@/pages/Password/Reset')
const RequestPasswordResetSuccess = () => import('@/pages/Password/RequestResetSuccess')
const Signup = () => import('@/pages/Signup')
const SignupTitle = () => import('@/components/Login/SignupTitle')
const VerifyMail = () => import('@/pages/VerifyMail')

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
]
