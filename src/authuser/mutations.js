import { useMutation } from 'vue-query'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import { withStatus } from '@/utils/queryHelpers'
import { useSetUser } from '@/authuser/queries'
import api from './api/auth'
import authUserAPI from './api/authUser'
import usersAPI from '@/users/api/users'
import { throttle } from 'quasar'
import { showToast } from '@/utils/toasts'

export function useLoginMutation () {
  const router = useRouter()
  const route = useRoute()
  const setUser = useSetUser()
  return withStatus(useMutation(
    ({ email, password }) => api.login({ email, password }),
    {
      onSuccess (user) {
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

        // TODO: where to do this? maybe on the useClearDataOnLogout() thing? as we can be logged out for other reasons than explicit logout
        // async logout ({ commit, dispatch }) {
        //   await dispatch('push/disable')
        //   await dispatch('fcm/disable', null, { root: true })
        //   await auth.logout()
        //
        //   commit('setUser', null)
        //   showLogoutToast(dispatch)
        //
        //   router.push({ name: 'groupsGallery' }).catch(() => {})
        // },
        // const showLogoutToast = throttle((dispatch) => {
        //   dispatch('toasts/show', {
        //     message: 'USERDATA.LOGOUT_SUCCESS',
        //     config: {
        //       timeout: 5000,
        //     },
        //   }, { root: true })
        // }, 5000)
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
        // TODO: option for backgroundSave? or useBackgroundSaveMutation ...
        showToast({
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        })
      },
    },
  ))
}

export function useVerifyEmailMutation () {
  return withStatus(useMutation(
    code => api.verifyMail(code),
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
