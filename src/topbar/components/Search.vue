<template>
  <QSelect
    :placeholder="$q.lang.label.search"
    :model-value="query"
    dense
    autofocus
    standout
    dark
    :options-dark="false"
    use-input
    :options="options"
    :input-debounce="300"
    @filter="selectFilter"
    @update:model-value="select"
    @keyup.esc="emit('close')"
  >
    <template #prepend>
      <QIcon name="search" />
    </template>
    <template #option="{ index, opt: { label, sublabel, icon, iconColor, user }, itemProps }">
      <QItem
        :key="index"
        v-bind="itemProps"
      >
        <QItemSection
          v-if="user"
          side
        >
          <ProfilePicture
            :user="user"
            :is-link="false"
            :size="25"
          />
        </QItemSection>
        <QItemSection
          v-else-if="icon"
          side
        >
          <QIcon
            :name="icon"
            :color="iconColor"
          />
        </QItemSection>
        <QItemSection>
          <QItemLabel>
            {{ label }}
          </QItemLabel>
          <QItemLabel
            v-if="sublabel"
            caption
          >
            {{ sublabel }}
          </QItemLabel>
        </QItemSection>
      </QItem>
    </template>
    <template #no-option>
      <QItem>
        <QItemSection>
          <QItemLabel>
            {{ $t('GLOBAL.SEARCH_NOT_FOUND') }}
          </QItemLabel>
        </QItemSection>
      </QItem>
    </template>
  </QSelect>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  QIcon,
  QSelect,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'

import { usePlaceService } from '@/places/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useUserService } from '@/users/services'
import icons from '@/base/icons'
import { optionsFor } from '@/places/placeStatus'

const emit = defineEmits(['close'])

const router = useRouter()

const query = ref('')

const { places } = usePlaceService()
// TODO: probably need a bit of filtering, includes all the inactive ones...
const { activeGroups, getGroupById } = useGroupInfoService()
const { users } = useUserService()

function select (option) {
  if (!option) return
  emit('close')
  router.push(option.value)
}

const options = shallowRef([])

const allOptions = computed(() => [
  ...places.value.filter(place => place.status !== 'archived').map(place => ({
    value: { name: 'place', params: { groupId: place.group, placeId: place.id } },
    label: place.name,
    sublabel: getGroupById(place.group).name,
    search: place.name.toLowerCase(),
    icon: icons.get('place'),
    iconColor: optionsFor(place).color,
  })),
  ...activeGroups.value.map(group => ({
    value: group.isMember ? { name: 'group', params: { groupId: group.id } } : { name: 'groupPreview', params: { groupPreviewId: group.id } },
    label: group.name,
    search: group.name.toLowerCase(),
    icon: 'fas fa-home',
    iconColor: group.isMember ? 'secondary' : undefined,
  })),
  ...users.value.map(user => ({
    value: { name: 'user', params: { userId: user.id } },
    label: user.displayName,
    search: user.displayName.toLowerCase(),
    user,
  })),
])

function selectFilter (value, update) {
  update(
    () => {
      // TODO: consider using something like https://fusejs.io for a fancier search index
      const lowerValue = value.toLowerCase()
      options.value = allOptions.value.filter(entry => entry.search.includes(lowerValue))
    },
    ref => {
      if (value !== '' && ref.options.length > 0) {
        ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
        ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
      }
    },
  )
}
</script>
