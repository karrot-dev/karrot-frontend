import { mapGetters } from 'vuex'
import store from '@/store'

export function mapGetterMethods (mapping) {
  let ctx = {
    $store: store
  }
  let methods = mapGetters(mapping)

  for (let key of Object.keys(methods)) {
    methods[key] = methods[key].call(ctx)
  }

  return methods
}
