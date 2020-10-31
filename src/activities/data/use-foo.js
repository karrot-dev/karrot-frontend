import { ref, provide, inject, shallowReadonly } from '@vue/composition-api'

const key = Symbol('Foo')

export function provideGlobalFoo (foo) {
  provide(key, foo)
}

export function useGlobalFoo () {
  return inject(key)
}

export function useFoo () {
  const groupId = ref(undefined)
  function setGroupId (id) {
    groupId.value = id
  }
  return {
    groupId: shallowReadonly(groupId),
    setGroupId,
  }
}
