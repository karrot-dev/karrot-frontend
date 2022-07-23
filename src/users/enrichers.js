import { useAuthService } from '@/authuser/services'

export function useUserEnricher () {
  const { id: userId } = useAuthService()

  // TODO: this doesn't include the "membership", and probably shouldn't, so have to fix up the places that use it...
  function enrichUser (user) {
    return {
      ...user,
      _enrichSource: user,
      isCurrentUser: user.id === userId.value,
      displayName: user.displayName || '?',
    }
  }

  return enrichUser
}
