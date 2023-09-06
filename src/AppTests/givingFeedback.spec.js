import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import subDays from 'date-fns/subDays'

import App from '@/App.vue'
import router from '@/router'

import { invalidateQueries, withDefaults } from '>/helpers'
import {
  createUser,
  createGroup,
  loginAs,
  createActivity,
  createPlace,
  createActivityType,
  createPlaceType,
} from '>/mockBackend'
import { joinActivity } from '>/mockBackend/activities'
import { addUserToGroup } from '>/mockBackend/groups'
import { useMockBackend } from '>/mockBackend/setup'

useMockBackend()

test('give activity feedback', async () => {
  const { type, click } = userEvent.setup()

  const user = createUser()
  const group = createGroup()
  addUserToGroup(user, group)

  createPlaceType({ group: group.id })

  const activity = createActivity({
    place: createPlace({ group: group.id }).id,
    activityType: createActivityType({
      group: group.id,
      hasFeedback: true,
      hasFeedbackWeight: true,
    }).id,
    // in the past, so we can give feedback to it
    startDate: subDays(new Date(), 5),
  })

  joinActivity(activity, user)

  user.currentGroup = group.id
  loginAs(user)

  const {
    getByTestId,
    findByText,
    findByRole,
    getByRole,
    findByLabelText,
  } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // from main group page we see we have some feedback we can give!
  await click(await findByText('You can give feedback'))

  // write a nice comment and put some weight in
  const feedbackComment = faker.lorem.paragraph(2)
  const feedbackWeight = faker.number.int({ min: 1, max: 150 })
  await type(
    await findByLabelText('Was everything fine? Did everyone show up? Your comment here...', { selector: 'textarea' }),
    feedbackComment,
  )
  await click(getByRole('button', { name: 'Set amount' }))
  await type(getByTestId('amount-picker'), String(feedbackWeight))

  // and send it off
  await click(await findByRole('button', { name: 'Create' }))

  await invalidateQueries()

  // oh, yay it's on the page!
  await findByText(feedbackComment)

  await findByText(`People gave feedback for ${feedbackWeight} kg of saved food already! Keep up the great work!`)
})
