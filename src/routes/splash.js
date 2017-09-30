const Login = () => import('@/pages/Login.vue')
const LoginTitle = () => import('@/components/Login/LoginTitle.vue')
const VerifyMailTitle = () => import('@/components/Login/VerifyMailTitle.vue')
const PasswordResetTitle = () => import('@/components/Login/PasswordResetTitle.vue')
const Signup = () => import('@/pages/Signup.vue')
const SignupTitle = () => import('@/components/Login/SignupTitle.vue')
const PasswordReset = () => import('@/pages/PasswordReset.vue')
const VerifyMail = () => import('@/pages/VerifyMail.vue')

export default [
  {
    name: 'login',
    path: '/login',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'LOGIN.TITLE', route: { name: 'login' } },
      ],
    },
    components: {
      default: Login,
      header: LoginTitle,
    },
  },
  {
    name: 'passwordreset',
    path: '/passwordreset',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'PASSWORDRESET.TITLE', route: { name: 'passwordreset' } },
      ],
    },
    components: {
      default: PasswordReset,
      header: PasswordResetTitle,
    },
  },
  {
    name: 'verifymail',
    path: '/verify-mail',
    meta: {
      requireLoggedIn: true,
      breadcrumbs: [
        { translation: 'VERIFYMAIL.TITLE', route: { name: 'verifymail' } },
      ],
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
    },
    components: {
      default: Signup,
      header: SignupTitle,
    },
  },
]
