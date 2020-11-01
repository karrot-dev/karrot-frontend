import { ref, provide, inject, shallowReadonly } from '@vue/composition-api'

const key = Symbol('GlobalCurrentGroup')

export function provideGlobalCurrentGroup (currentGroup) {
  provide(key, currentGroup)
}

export function useGlobalCurrentGroup () {
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
