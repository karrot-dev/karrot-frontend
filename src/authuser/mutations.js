import { throttle } from 'quasar'
import { useMutation, useQueryClient } from 'vue-query'
import { useRoute, useRouter } from 'vue-router'

import { useSetAuthUser } from '@/authuser/queries'
import { usePushService } from '@/subscriptions/services/push'
import { useTokenService } from '@/subscriptions/services/token'
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
  const setAuthUser = useSetAuthUser()
  return withStatus(useMutation(
    ({ email, password }) => api.login({ email, password }),
    {
      onSuccess (user) {
        // We might have some logged out data, let's start fresh :)
        queryClient.resetQueries([])

        setAuthUser(user)

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

const showLogoutToast = throttle(() => showToast({
  message: 'USERDATA.LOGOUT_SUCCESS',
  config: {
    timeout: 5000,
  },
}), 5000)

export function useLogoutMutation () {
  const router = useRouter()
  const setAuthUser = useSetAuthUser()
  const { deleteToken } = usePushService()
  const { deleteToken: deleteTokenFromServer } = useTokenService()

  return withStatus(useMutation(
    () => api.logout(),
    {
      async onMutate () {
        // Before the logout...
        // We wait for the response as we need to be logged in still
        await Promise.all([
          // removes the token from browser and fcm
          deleteToken(),
          // removes the subscription from server
          // TODO: would be better to have the subscriptions associated with sessions and clear them on the server
          deleteTokenFromServer(),
        ])
      },
      async onSuccess () {
        await router.push({ name: 'groupsGallery' })
        showLogoutToast()
        setAuthUser(null)
      },
    },
  ))
}

export function useSaveUserMutation () {
  const setAuthUser = useSetAuthUser()
  return withStatus(useMutation(
    data => authUserAPI.save(data),
    {
      onSuccess (user) {
        setAuthUser(user)
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
