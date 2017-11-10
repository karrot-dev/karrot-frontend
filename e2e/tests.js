import { Selector } from 'testcafe'

fixture('default page')
  .page('http://localhost:8181/#/')

test('signup flow works', async t => {
  await t.takeScreenshot()
  const location = await t.eval(() => window.location)
  await t.expect(location.hash).eql('#/groupInfo')
  const title = await t.eval(() => document.title)
  await t.expect(title).eql('All groups · Karrot')

  const firstInfoButton = 'div.inline-block:nth-child(1) > div:nth-child(1) > div:nth-child(4) > button:nth-child(1)'
  await t.click(firstInfoButton)

  const loginOrSignupButton = await Selector('.q-card-actions button')
  await t.expect(loginOrSignupButton.innerText).contains('LOG IN OR SIGN UP TO JOIN THIS GROUP!')
  await t.click(loginOrSignupButton)

  await t.expect(await t.eval(() => document.title)).eql('Sign Up! · Karrot')
  const nameField = 'div.white-box:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
  const emailField = 'div.white-box:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
  const passwordField = 'div.white-box:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
  await t
    .typeText(nameField, 'E2E Testuser')
    .typeText(emailField, 'user3@example.com')
    .typeText(passwordField, 'user')
  await t.takeScreenshot()
  await t.pressKey('enter')
})
