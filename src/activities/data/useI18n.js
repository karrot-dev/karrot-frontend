import { getCurrentInstance } from '@vue/composition-api'

// this *should* match the future api of vue-i18n
// See https://github.com/kazupon/vue-i18n/issues/693#issuecomment-630275865
export function useI18n () {
  const vm = getCurrentInstance()
  return {
    t: vm.$t.bind(vm),
    d: vm.$d.bind(vm),
  }
}
