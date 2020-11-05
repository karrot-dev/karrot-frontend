import { ref, provide, inject, shallowReadonly } from '@vue/composition-api'

const key = Symbol('CurrentGroup')

export function provideCurrentGroup (currentGroup) {
  provide(key, currentGroup)
}

export function useCurrentGroup () {
  return inject(key)
}

export function createCurrentGroup () {
  const groupId = ref(null)
  function setCurrentGroupId (id) {
    groupId.value = id === undefined ? null : id
  }
  return {
    currentGroupId: shallowReadonly(groupId),
    setCurrentGroupId,
  }
}
