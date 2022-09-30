import reactiveNow from '@/utils/reactiveNow'

export function useAgreementHelpers () {
  function getAgreementIsActive (agreement) {
    return agreement.activeFrom < reactiveNow.value && (!agreement.activeTo || agreement.activeTo > reactiveNow.value)
  }

  return {
    getAgreementIsActive,
  }
}
