import { Selector, Role } from 'testcafe'
const testTime = Math.floor(new Date() / 1000)
console.log(testTime)

const testUser = Role('http://localhost:8080/#/login', async t => {
  const mailField = Selector('div').withText('Mail').child('input')
  const passwordField = Selector('div').withText('Password').child('input')
  await t
    .selectText(mailField)
    .typeText(mailField, `user${testTime}@example.com`)
    .selectText(passwordField)
    .typeText(passwordField, 'user')
    .pressKey('enter')
})

fixture('homepage')
  .page('http://localhost:8080/')

test('create user', async t => {
  await t
    .click(Selector('button').withText('SIGN UP!'))
  await t
    .expect(await t.eval(() => document.title)).eql('Sign Up! · Karrot')
    .typeText(Selector('div').withText('Name').child('input'), 'E2E Testuser')
    .typeText(Selector('div').withText('Mail').child('input'), `user${testTime}@example.com`)
    .typeText(Selector('div').withText('Password').child('input'), 'user')
    .pressKey('enter')
    .expect(Selector('.fa-user').parent(0).innerText).contains('E2E TESTUSER')
})

test.skip('login', async t => {
  const mailField = Selector('div').withText('Mail').child('input')
  const passwordField = Selector('div').withText('Password').child('input')
  await t
    .click(Selector('button').withText('LOGIN'))
    .expect(await t.eval(() => document.title)).eql('Login · Karrot')
    .selectText(mailField)
    .typeText(mailField, `user${testTime}@example.com`)
    .selectText(passwordField)
    .typeText(passwordField, 'user')
    .pressKey('enter')
    .expect(Selector('.fa-user').parent(0).innerText).contains('E2E TESTUSER')
})

test('create group', async t => {
  await t
    .useRole(testUser)
    .navigateTo('/#/group/create')
    .typeText('#group-title', `testgroup ${testTime}`)
    .pressKey('enter')
    .expect(Selector('.lastElement').innerText).contains(testTime)
})

test('select a group, signs in and gets added to the group', async t => {
  await t
    .click(Selector('div').withText(`testgroup ${testTime}`).parent('.q-card').find('button'))
    .click(Selector('button').withText('LOG IN OR SIGN UP'))
  await t
    .expect(await t.eval(() => document.title)).eql('Sign Up! · Karrot')
    .typeText(Selector('div').withText('Name').child('input'), 'Testuser B')
    .typeText(Selector('div').withText('Mail').child('input'), `userB${testTime}@example.com`)
    .typeText(Selector('div').withText('Password').child('input'), 'user')
    .pressKey('enter')
    .expect(Selector('.lastElement').innerText).contains(testTime)
})
