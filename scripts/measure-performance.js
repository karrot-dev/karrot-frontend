const puppeteer = require('puppeteer')
const axios = require('axios')
const cookie = require('cookie')

puppeteer.launch({ headless: false }).then(async browser => {
  // log in directly via API
  const data = await axios.post('http://localhost:8080/api/auth/', {
    email: 'foo@foo.com',
    password: 'foofoo',
  })

  // suck out the cookies (pretty crappy/flakey implementation)
  const cookies = data.headers['set-cookie'].map(cookie.parse).map(d => {
    return {
      name: d.csrftoken ? 'csrftoken' : 'sessionid',
      value: d.csrftoken || d.sessionid,
      domain: 'localhost:8080',
      path: d.Path,
      sameSite: d.SameSite,
      expires: new Date(d.expires).getTime() / 1000,
    }
  })

  console.log('cookies', cookies)

  const page = await browser.newPage()

  page.setCookie(...cookies)

  await page.exposeFunction('onCustomEvent', ({ type, detail }) => {
    console.log(detail)
    browser.close()
  })

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('measured', ({ type, detail }) => {
      window.onCustomEvent({ type, detail })
    })
  })

  await page.goto('http://localhost:8080/')
})
