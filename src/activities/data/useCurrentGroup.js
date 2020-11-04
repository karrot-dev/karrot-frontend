import { ref, provide, inject, shallowReadonly } from '@vue/composition-api'

const key = Symbol('GlobalCurrentGroup')

export function provideGlobalCurrentGroup (currentGroup) {
  provide(key, currentGroup)
}

export function useGlobalCurrentGroup () {
  return inject(key)
}

// TODO: think current group should always just keep itself updated... be a singluar one... given the word "current" is in it
export function useCurrentGroup () {
  const groupId = ref(null)
  function setCurrentGroupId (id) {
    groupId.value = id === undefined ? null : id
  }
  return {
    currentGroupId: shallowReadonly(groupId),
    setCurrentGroupId,
  }
}
