import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'

import GroupSettings from './GroupSettings'

const changeNotificationType = action('changeNotificationType')

storiesOf('GroupSettings', module)
  .add('show', () => {
    // Create a reactive copy of the group
    const group = new Vue({ data: { ...groupsMock[0] } })

    return defaults({
      render: h => h(GroupSettings, {
        props: {
          group,
        },
        on: {
          changeNotificationType ({ notificationType, enabled }) {
            // Add or remove it from our group array
            const idx = group.notificationTypes.indexOf(notificationType)
            if (enabled) {
              if (idx === -1) group.notificationTypes.push(notificationType)
            }
            else {
              if (idx !== -1) group.notificationTypes.splice(idx, 1)
            }
            changeNotificationType(notificationType, enabled)
          },
        },
      }),
    })
  })
