import { ref, provide, inject, shallowReadonly } from '@vue/composition-api'

const key = Symbol('Foo')

export function provideGlobalFoo (foo) {
  provide(key, foo)
}

export function useGlobalFoo () {
  return inject(key)
}

export function useCurrentGroup () {
  const groupId = ref(undefined)
  function setCurrentGroupId (id) {
    groupId.value = id
  }
  return {
    currentGroupId: shallowReadonly(groupId),
    setCurrentGroupId,
  }
}
