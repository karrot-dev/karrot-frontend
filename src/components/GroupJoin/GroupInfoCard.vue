<template>
  <div>
    <q-alert v-if="!group.isMember" color="tertiary" icon="info">
      {{ $t('JOINGROUP.PROFILE_NOTE' )}}
    </q-alert>
    <q-card>
      <q-card-title>
        {{ group.name }}
        <span slot="subtitle">
          {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
        </span>
      </q-card-title>
      <q-card-main>
        <Markdown
          v-if="group.publicDescription"
          class="quote"
          :source="group.publicDescription"
        />
        <span v-else class="text-italic">
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <span v-if="!group.isMember">
          <form name="joingroup" @submit.prevent="$emit('join', { groupId: group.id, password })">
            <q-field
              v-if="group.protected"
              icon="fa-lock"
              :label="$t('JOINGROUP.PASSWORD_REQUIRED')"
              :helper="$t('JOINGROUP.PASSWORD_LABEL')"
              :error="!!status.error"
              :error-label="$t('JOINGROUP.PASSWORD_WRONG')"
              >
              <q-input v-model="password" type="password" />
            </q-field>
            <q-btn type="submit" loader :value="status.isWaiting" >
              <span v-if="isLoggedIn">
                {{ $t('BUTTON.JOIN') }}
              </span>
              <span v-else>
                {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
              </span>
            </q-btn>
          </form>
        </span>
        <q-btn v-if="group.isMember" @click="$emit('visit', { groupId: group.id })" class="q-btn-flat">
          <q-icon name="fa-home" />
          <q-tooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QField, QInput, QIcon, QTooltip, QAlert } from 'quasar'
import Markdown from '@/components/Markdown'

export default {
  data () {
    return { password: '' }
  },
  props: {
    group: { required: true },
    status: { required: true },
    isLoggedIn: {},
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QField, QInput, QIcon, QTooltip, QAlert, Markdown },
}
</script>

<style scoped lang="stylus">
.q-card *
  overflow: hidden
</style>
