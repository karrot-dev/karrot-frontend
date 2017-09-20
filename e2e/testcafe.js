import { Selector } from 'testcafe'

fixture('default page')
  .page('http://localhost:8080/#/')
//  .page('https://karrot-dev.foodsaving.world')

test('loads login page', async t => {
  await t
    .takeScreenshot()
  const location = await t.eval(() => window.location)
  await t.expect(location.hash).eql('#/login')
  const title = await t.eval(() => document.title)
  await t.expect(title).eql('Login | Karrot')
})

test('can log in', async t => {
  // using prefilled login in dev mode
  // const emailfield = 'div.white-box:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
  // const passwordfield = 'div.white-box:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
  const loginbutton = '.submit'
  await t
    // .typeText(emailfield, 'foo@foo.com')
    // .typeText(passwordfield, 'foofoo')
    .pressKey('enter')

  await t.takeScreenshot()
  await t.click(loginbutton) // pressing enter does not submit the form on "Chrome@61.0:OS X 10.9"
  await t.takeScreenshot()
  const location = await t.eval(() => window.location)
  await t.expect(location.hash).eql('#/group/1/wall')
  const title = await t.eval(() => document.title)
  await t.expect(title).eql('05_testgroup | Karrot')
})
