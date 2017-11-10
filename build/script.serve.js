const express = require('express')
const bodyParser = require('body-parser')
const { join } = require('path')

/**
 * Serve static files
 */
const app = express()
app.use(express.static(join(__dirname, '../dist')))

/**
 * Provide mock API endpoints
 */
app.use(bodyParser.json())

const state = {
  loggedIn: false,
  newUsers: [],
  authedUser: null,
  publicGroupData:     {
    "id": 6,
    "name": "01_testgroup_with_maps",
    "public_description": "asdf",
    "address": "19, Nordenskiöldsgatan, Olivedal, Majorna-Linné, Gothenburg, Göteborg, Västra Götalands län, Götaland, 41309, Sweden",
    "latitude": 57.6927122,
    "longitude": 11.9510521,
    "members": [
      57,
      33,
      64,
      39,
      28,
      42,
      69,
      71,
      72,
      75,
      77,
      31,
      79,
      40,
      81,
      84,
      86,
      95,
      96,
      45,
      104,
      105,
      107,
      108,
      10,
      32,
      112,
      4,
      114,
      129,
      134,
      136,
      7,
      139,
      140,
      141,
      142,
      143,
      144,
      146,
      149,
      145,
      162,
      163,
      185,
      216,
      219,
      180,
      189,
      1,
      194,
      17,
      202,
      22,
      13,
      29,
      8
    ],
    "protected": true
  },
  groupData: {
    "id": 6,
    "name": "01_testgroup_with_maps",
    "description": "Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)\n\nand it should have loads of text!!\n\nYes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)Yes, there are maps included!\n(Used to be called 'foodsharing Rotterdam', but is just the biggest test group, so it got renamed...^^)",
    "public_description": "asdf",
    "members": [
      57,
      33,
      64,
      39,
      28,
      42,
      69,
      71,
      72,
      75,
      77,
      31,
      79,
      40,
      81,
      84,
      86,
      95,
      96,
      45,
      104,
      105,
      107,
      108,
      10,
      32,
      112,
      4,
      114,
      129,
      134,
      136,
      7,
      139,
      140,
      141,
      142,
      143,
      144,
      146,
      149,
      145,
      162,
      163,
      185,
      216,
      219,
      180,
      189,
      1,
      194,
      17,
      202,
      22,
      13,
      29,
      8
    ],
    "memberships": {
      "1": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "4": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "7": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "8": {
        "created_at": "2017-10-28T14:28:53.142616Z",
        "roles": []
      },
      "10": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "13": {
        "created_at": "2017-10-12T02:24:49.862902Z",
        "roles": []
      },
      "17": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": [
          "membership_manager"
        ]
      },
      "22": {
        "created_at": "2017-09-21T00:16:08.788685Z",
        "roles": []
      },
      "28": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "29": {
        "created_at": "2017-10-23T10:56:53.153313Z",
        "roles": []
      },
      "31": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "32": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "33": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "39": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "40": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "42": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "45": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "57": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "64": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "69": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "71": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "72": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "75": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "77": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "79": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "81": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "84": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "86": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "95": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "96": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "104": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "105": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "107": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "108": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "112": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "114": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "129": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "134": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "136": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "139": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "140": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "141": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "142": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "143": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "144": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "145": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "146": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "149": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "162": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "163": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "180": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "185": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "189": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "194": {
        "created_at": "2017-08-31T11:00:58.090310Z",
        "roles": []
      },
      "202": {
        "created_at": "2017-09-14T17:26:02.520613Z",
        "roles": []
      },
      "216": {
        "created_at": "2017-09-22T14:02:58.466214Z",
        "roles": []
      },
      "219": {
        "created_at": "2017-09-28T23:03:34.933826Z",
        "roles": []
      }
    },
    "address": "19, Nordenskiöldsgatan, Olivedal, Majorna-Linné, Gothenburg, Göteborg, Västra Götalands län, Götaland, 41309, Sweden",
    "latitude": 57.6927122,
    "longitude": 11.9510521,
    "timezone": "Europe/Berlin",
    "slack_webhook": "",
    "active_agreement": null
  },
}

const defaultUser = {
  "id": 8,
  "display_name": "Tilmann Becker",
  "email": "tilmann.becker@gmail.com",
  "unverified_email": "tilmann.becker@gmail.com",
  "address": null,
  "latitude": null,
  "longitude": null,
  "description": "https://github.com/tiltec\n\nCome, [join](https://project.yunity.org/join-the-team) yunity! You can also directly [join our slack chat](http://slackin.yunity.org/).\n\nWe are looking for contributors (and food)",
  "mail_verified": true,
  "key_expires_at": null,
  "current_group": 1,
  "language": "de"
}

const authedUser = ({ authedUser }) => {
  if (!authedUser) return defaultUser
  return authedUser
}

const authStatus = (state) => {
  const { loggedIn } = state
  if (loggedIn) {
    return { status: 200, data: authedUser(state) }
  }
  else {
    return {
      status: 401,
      data: { error: 'not_authed' }
    }
  }
}

getGroupData = (state) => {
  const user = authedUser(state)
  if (state.publicGroupData.members.includes(user.id)) {
    return state.groupData
  }
  else {
    return state.publicGroupData
  }
}

app.get('/api/auth/status/', (req, res) => {
  const { status, data } = authStatus(state)
  res.status(status).json(data)
})

app.post('/api/auth/', (req, res) => {
  console.log('login request', req.body)
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'forbidden' })
  }
  state.loggedIn = true
  state.authedUser = state.newUsers.find(e => e.email === email)
  const { status, data } = authStatus(state)
  console.log('login successful', state.authedUser)
  res.status(status).json(data)
})

app.get('/api/groups/', (req, res) => {
  res.status(200).json([
    {
      "id": 13,
      "name": "04_testgroup",
      "public_description": "Hi there! This it the public description!",
      "address": "Algeciras, Cádiz, Andalusia, Spain",
      "latitude": 36.1445288570277,
      "longitude": -5.45059204101562,
      "members": [
        184,
        151,
        148,
        159,
        10,
        34,
        28,
        67,
        120,
        17,
        7,
        4,
        45,
        187,
        22,
        1,
        8,
        219,
        222,
        29
      ],
      "protected": false
    },
    {
      "id": 2,
      "name": "06_testgroup",
      "public_description": "",
      "address": "Grönland",
      "latitude": 77.6192349,
      "longitude": -42.8125966,
      "members": [
        184,
        172,
        179,
        34,
        18,
        75,
        66,
        17,
        187,
        186,
        195,
        183,
        22,
        1,
        222,
        29
      ],
      "protected": false
    },
    {
      "id": 4,
      "name": "03_testgroup",
      "public_description": "",
      "address": "Grönland",
      "latitude": 77.6192349,
      "longitude": -42.8125966,
      "members": [
        184,
        37,
        43,
        60,
        68,
        76,
        66,
        90,
        17,
        45,
        22,
        1,
        222,
        29
      ],
      "protected": false
    },
    {
      "id": 3,
      "name": "02_testgroup",
      "public_description": "",
      "address": null,
      "latitude": null,
      "longitude": null,
      "members": [
        182,
        184,
        138,
        140,
        146,
        152,
        148,
        145,
        168,
        10,
        180,
        178,
        34,
        39,
        38,
        74,
        54,
        70,
        75,
        66,
        31,
        96,
        123,
        17,
        130,
        135,
        187,
        32,
        195,
        190,
        183,
        22,
        188,
        1,
        217,
        8,
        219,
        222,
        29,
        220,
        221
      ],
      "protected": false
    },
    {
      "id": 1,
      "name": "05_testgroup Besançon",
      "public_description": "This is the public description :sparkles:\nIt would make sense if it was markdown\n\n# then this would be a header\n[and this a link](www.google.de)",
      "address": "Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland",
      "latitude": 49.872775,
      "longitude": 8.651177,
      "members": [
        184,
        6,
        18,
        28,
        65,
        76,
        73,
        54,
        96,
        117,
        17,
        45,
        195,
        183,
        196,
        22,
        1,
        8,
        222,
        29
      ],
      "protected": false
    },
    {
      "id": 6,
      "name": "01_testgroup_with_maps",
      "public_description": "asdf",
      "address": "19, Nordenskiöldsgatan, Olivedal, Majorna-Linné, Gothenburg, Göteborg, Västra Götalands län, Götaland, 41309, Sweden",
      "latitude": 57.6927122,
      "longitude": 11.9510521,
      "members": [
        57,
        33,
        64,
        39,
        28,
        42,
        69,
        71,
        72,
        75,
        77,
        31,
        79,
        40,
        81,
        84,
        86,
        95,
        96,
        45,
        104,
        105,
        107,
        108,
        10,
        32,
        112,
        4,
        114,
        129,
        134,
        136,
        7,
        139,
        140,
        141,
        142,
        143,
        144,
        146,
        149,
        145,
        162,
        163,
        185,
        216,
        219,
        180,
        189,
        1,
        194,
        17,
        202,
        22,
        13,
        29,
        8
      ],
      "protected": false
    },
    {
      "id": 20,
      "name": "kjölkjlasdf",
      "public_description": "",
      "address": null,
      "latitude": null,
      "longitude": null,
      "members": [
        22
      ],
      "protected": false
    }
  ])
})

app.get('/api/groups/6/', (req, res) => {
  res.json(getGroupData(state))
})

app.get('/api/stores/', (req, res) => res.json([]))
app.get('/api/pickup-dates/', (req, res) => res.json([]))
app.get('/api/groups/6/conversation/', (req, res) => res.json({
  "id": 2,
  "participants": [
    194,
    17,
    202,
    22,
    216,
    219,
    13,
    29,
    139,
    140,
    141,
    142,
    144,
    146,
    149,
    145,
    136,
    10,
    162,
    163,
    180,
    143,
    28,
    39,
    42,
    33,
    57,
    40,
    64,
    71,
    72,
    79,
    77,
    69,
    75,
    86,
    31,
    95,
    96,
    105,
    104,
    108,
    84,
    112,
    107,
    114,
    129,
    134,
    7,
    81,
    4,
    45,
    185,
    32,
    189,
    1,
    8
  ],
  "created_at": "2017-08-11T08:02:35.659660Z"
}))

app.get('/api/messages/', (req, res) => res.json({ results: [] }))
app.get('/api/users/', (req, res) => res.json(state.newUsers))

app.post('/api/users/', (req, res) => {
  const newUser = { id: 1000, ...req.body }
  state.newUsers.push(newUser)
  console.log('sign up successful')
  res.json(newUser)
})

app.patch('/api/users/:userId/', (req, res) => {
  state.newUsers[0] = {
    ...state.newUsers[0],
    ...req.body,
  }
})

app.post('/api/groups/:groupId/join/', (req, res) => {
  console.log('join group request')
  user = authedUser(state)
  state.publicGroupData.members.push(user.id)
  state.groupData.members.push(user.id)
  console.log('join group successful')
  res.json({})
})


/**
 * Run server
 */

app.listen(8181, () => {
  console.log('listening')
})
