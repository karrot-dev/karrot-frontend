const Login = () => import('@/authuser/pages/Login.vue')
const LoginTitle = () => import('@/authuser/components/LoginTitle.vue')
const VerifyMailTitle = () => import('@/authuser/components/VerifyMailTitle.vue')
const RequestPasswordResetTitle = () => import('@/authuser/components/RequestPasswordResetTitle.vue')
const RequestPasswordReset = () => import('@/authuser/pages/RequestReset.vue')
const PasswordResetTitle = () => import('@/authuser/components/PasswordResetTitle.vue')
const PasswordReset = () => import('@/authuser/pages/Reset.vue')
const RequestPasswordResetSuccess = () => import('@/authuser/pages/RequestResetSuccess.vue')
const Signup = () => import('@/authuser/pages/Signup.vue')
const SignupTitle = () => import('@/authuser/components/SignupTitle.vue')
const VerifyMail = () => import('@/authuser/pages/VerifyMail.vue')
const DeleteAccount = () => import('@/authuser/pages/DeleteAccount.vue')
const DeleteAccountTitle = () => import('@/authuser/components/Settings/DeleteAccountTitle.vue')
const ApplicationForm = () => import('@/applications/pages/ApplicationForm.vue')
const ApplicationFormTitle = () => import('@/applications/components/ApplicationFormTitle.vue')
const Unsubscribe = () => import('@/unsubscribe/pages/Unsubscribe.vue')
const UnsubscribeTitle = () => import('@/unsubscribe/components/UnsubscribeTitle.vue')

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
  {
    name: 'deleteAccount',
    path: '/delete-user',
    meta: {
      requireLoggedOut: true,
      breadcrumbs: [
        { translation: 'DELETEACCOUNT.TITLE' },
      ],
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
