import { throttle } from 'quasar'
import { useMutation, useQueryClient } from 'vue-query'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useSetUser } from '@/authuser/queries'
import unsubscribeAPI from '@/unsubscribe/api/unsubscribe'
import usersAPI from '@/users/api/users'
import { withStatus } from '@/utils/queryHelpers'
import { showToast } from '@/utils/toasts'

import api from './api/auth'
import authUserAPI from './api/authUser'

export function useSignupMutation () {
  return withStatus(useMutation(userData => authUserAPI.create(userData)))
}

export function useLoginMutation () {
  const queryClient = useQueryClient()
  const router = useRouter()
  const route = useRoute()
  const setUser = useSetUser()
  return withStatus(useMutation(
    ({ email, password }) => api.login({ email, password }),
    {
      onSuccess (user) {
        // We might have some logged out data, let's start fresh :)
        queryClient.resetQueries([])

        setUser(user)

        // then do stuff
        // - set locale for i18n
        //   - or do that in query onSuccess? so whereever it's received it goes there?

        if (route.query.to) {
          router.push(route.query.to)
        }
        else {
          router.push('/')
        }
      },
    },
  ))
}

export function useLogoutMutation () {
  const router = useRouter()
  const store = useStore()
  const setUser = useSetUser()

  const showLogoutToast = throttle(() => showToast({
    message: 'USERDATA.LOGOUT_SUCCESS',
    config: {
      timeout: 5000,
    },
  }), 5000)

  return withStatus(useMutation(
    () => api.logout(),
    {
      async onMutate () {
        // Before the logout..
        await Promise.all([
          store.dispatch('push/disable'),
          store.dispatch('fcm/disable'),
        ])
      },
      onSuccess () {
        router.push({ name: 'groupsGallery' })
        setUser(null)
        showLogoutToast()
      },
    },
  ))
}

export function useSaveUserMutation () {
  const setUser = useSetUser()
  return withStatus(useMutation(
    data => authUserAPI.save(data),
    {
      onSuccess (user) {
        setUser(user)
      },
    },
  ))
}

export function useVerifyEmailMutation () {
  return withStatus(useMutation(
    code => api.verifyMail(code),
  ))
}

export function useUnsubscribeAllMutation () {
  return withStatus(useMutation(
    groupId => unsubscribeAPI.unsubscribe({ group: groupId, choice: 'group' }),
    {
      onSuccess (counts) {
        const { conversations: formerConversations, threads: formerReplies } = counts
        showToast({
          message: 'UNSUBSCRIBE.COUNTS',
          messageParams: { formerConversations, formerReplies },
        })
      },
    },
  ))
}

export function useRequestPasswordResetMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    email => api.requestResetPassword(email),
    {
      onSuccess () {
        router.push({ name: 'requestPasswordResetSuccess' })
      },
    },
  ))
}

export function usePasswordResetMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    data => api.resetPassword(data),
    {
      onSuccess () {
        router.push({ name: 'login' })
        showToast({
          message: 'PASSWORD.RESET.SUCCESS',
        })
      },
    },
  ))
}

export function useRequestDeleteAccountMutation () {
  const { mutate: logout } = useLogoutMutation()
  return withStatus(useMutation(
    () => usersAPI.requestDeleteAccount(),
    {
      onSuccess () {
        showToast({
          message: 'USERDATA.REQUEST_DELETE_ACCOUNT.SUCCESS',
        })
        logout()
      },
    },
  ))
}

export function useDeleteAccountMutation () {
  return withStatus(useMutation(
    code => usersAPI.deleteAccount(code),
  ))
}

export function useChangeEmailMutation () {
  return withStatus(useMutation(
    ({ newEmail, password }) => api.changeEmail({ newEmail, password }),
  ))
}

export function useResendVerificationCode () {
  return withStatus(useMutation(
    () => api.resendVerificationCode(),
  ))
}

export function useChangePasswordMutation () {
  return withStatus(useMutation(
    ({ oldPassword, newPassword }) => api.changePassword({ oldPassword, newPassword }),
    {
      onSuccess () {
        showToast({
          message: 'PASSWORD.CHANGE.SUCCESS',
        })
      },
    },
  ))
}
