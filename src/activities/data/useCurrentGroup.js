import groupAPI from '@/group/api/groups'
import { ref, unref, provide, inject, computed, shallowReadonly } from '@vue/composition-api'
import { useAuthUser } from '@/activities/data/useAuthUser'

const key = Symbol('CurrentGroup')

export function provideCurrentGroup (currentGroup) {
  provide(key, currentGroup)
}

export function useCurrentGroup () {
  return inject(key)
}

export function createCurrentGroup () {
  const groupId = ref(null)
  const group = ref(null)

  async function setCurrentGroupId (id) {
    // fetch group!
    // TODO: use singluar fetcher thing I haven't made yet...
    groupId.value = id === undefined ? null : id
    if (id) {
      const result = await groupAPI.get(id)
      if (result.id === groupId.value) {
        group.value = result
      }
    }
    else {
      group.value = null
    }
  }

  return {
    currentGroup: shallowReadonly(group),
    currentGroupId: shallowReadonly(groupId),
    setCurrentGroupId,
  }
}

export function useEnrichedCurrentGroup () {
  const { group } = useCurrentGroup()
  const { enrichedGroup } = useEnrichedGroup({ group })
  return {
    enrichedGroup,
  }
}

export function useEnrichedGroup ({ group }) {
  const { authUserId } = useAuthUser()
  const memberships = computed(() => {
    if (!unref(group).memberships) return []
    return Object.entries(unref(group).memberships).reduce((obj, [userId, membership]) => {
      // cannot enrich trustedBy and addedBy, as it would create the cyclic dependency "user -> group -> user"
      // TODO: actually probably can now with getUser how it's implemented...
      const isEditor = membership.roles.includes('editor')
      const { trustThresholdForNewcomer } = unref(group)
      obj[userId] = {
        ...membership,
        isEditor,
        trusted: membership.trustedBy.includes(unref(authUserId)),
        trustProgress: isEditor ? 1 : membership.trustedBy.length / trustThresholdForNewcomer,
        trustThresholdForNewcomer,
      }
      return obj
    }, {})
  })
  const membership = computed(() => unref(authUserId) && unref(memberships)[unref(authUserId)])
  const enrichedGroup = computed(() => {
    const isPlayground = group.status === 'playground'
    return {
      ...group,
      isPlayground,
      isBikeKitchen: group.theme === 'bikekitchen',
      isGeneralPurpose: group.theme === 'general',
      hasPhoto: group.photoUrls && group.photoUrls.fullSize,
      hasLocation: group.latitude && group.longitude,
      membership: unref(membership),
      memberships: unref(memberships),
      // TODO: .. agreements
      activeAgreement: null,
      awaitingAgreement: false,
    }
  })
  return {
    enrichedGroup,
    membership,
    memberships,
  }
}
