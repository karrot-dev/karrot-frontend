/**
 * This file contains enriched mock data, similar to those coming from vuex getters.
 *
 * It is probably better for most use cases to use the factory functions from 'enrichedFactories.js' instead.
 */

import { statusMocks } from '>/helpers'
import { optionsFor } from '@/places/placeStatus'
import addSeconds from 'date-fns/add_seconds'

export const groupsMock = [
  { 'applicationQuestions': 'Hello stranger! :smiley: :wave: Do you want to help us save all the good food from being wasted? Please tell us how you plan to contribute and who or what made you aware of our existence! Looking forward to working with you!', 'id': 1, 'name': '05_testgroup', 'publicDescription': 'This is the public description\nIt would make sense if it was markdown\n\n# then this would be a header\n[and this a link](www.google.de)', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.872775, 'longitude': 8.651177, 'members': [184, 6, 18, 28, 65, 76, 73, 96, 117, 17, 29, 45, 195, 1, 183, 196, 22, 8], 'protected': false, 'conversationId': 1 },
  { 'id': 2, 'name': '06_testgroup', 'publicDescription': '', 'address': 'Grönland', 'latitude': 77.6192349, 'longitude': -42.8125966, 'members': [184, 172, 179, 34, 18, 75, 66, 17, 29, 187, 186, 195, 183], 'protected': false },
  { 'id': 3, 'name': '02_testgroup', 'publicDescription': '', 'address': null, 'latitude': null, 'longitude': null, 'members': [182, 184, 138, 140, 146, 152, 148, 145, 168, 10, 180, 178, 34, 39, 38, 74, 70, 75, 66, 31, 96, 123, 17, 130, 135, 187, 32, 195, 1, 190, 183, 22, 188], 'protected': false },
  { 'id': 4, 'name': '03_testgroup', 'publicDescription': '', 'address': 'Grönland', 'latitude': 77.6192349, 'longitude': -42.8125966, 'members': [184, 37, 43, 60, 68, 76, 66, 90, 17, 29, 45, 22], 'protected': false },
  { 'id': 6, 'name': '01_testgroup_with_maps_and_password', 'publicDescription': 'To enter this group, type "abc" as password (if nobody changed it!)', 'address': '19, Nordenskiöldsgatan, Olivedal, Majorna-Linné, Gothenburg, Göteborg, Västra Götalands län, Götaland, 41309, Sweden', 'latitude': 57.6927122, 'longitude': 11.9510521, 'members': [139, 140, 141, 142, 144, 146, 149, 145, 136, 10, 162, 163, 180, 143, 28, 39, 42, 33, 57, 40, 64, 71, 72, 79, 77, 69, 75, 86, 31, 95, 96, 105, 104, 108, 84, 112, 107, 114, 129, 17, 134, 7, 81, 29, 4, 45, 185, 32, 1, 202, 8, 189, 194], 'protected': true },
  { 'id': 13, 'name': '04_testgroup', 'publicDescription': 'Hi there! This it the public description!', 'address': 'Algeciras, Cádiz, Andalusia, Spain', 'latitude': 36.1445288570277, 'longitude': -5.45059204101562, 'members': [184, 151, 148, 159, 10, 34, 28, 67, 120, 17, 7, 29, 4, 45, 187, 1, 22, 8], 'protected': false },
].map(e => ({
  ...e,
  isCurrentGroup: false,
  isPlayground: false,
  joinStatus: statusMocks.default(),
  saveStatus: statusMocks.default(),
  leaveStatus: statusMocks.default(),
  notificationTypes: [],
  issueVotingDurationDays: 7,
}))

export const currentUserMock = { 'id': 5, 'displayName': 'Current User', 'email': 'current@user.de', 'unverifiedEmail': 'current@user.de', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.8980022441358, 'longitude': 8.66015739059448, 'description': 'I am the current User!', 'mailVerified': true, 'keyExpiresAt': '2017-08-02T21:22:54.730980Z', 'currentGroup': 1, 'language': 'de', isCurrentUser: true, photoUrls: {} }

export const usersMockWithoutCurrent = [
  { 'id': 1, 'displayName': 'Mira Bellenbaum', 'email': 'l@l.de', 'unverifiedEmail': 'l@l.de', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.8990022441358, 'longitude': 8.66415739059448, 'description': 'This is me!', 'mailVerified': false, 'keyExpiresAt': '2017-08-02T21:22:54.730980Z', 'currentGroup': 1, 'language': 'en', isCurrentUser: false, photoUrls: {} },
  { 'id': 2, 'displayName': 'Max Mustermann', 'email': 'm@m.de', 'unverifiedEmail': 'm@m.de', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.9090022441358, 'longitude': 8.66815739059448, 'description': 'This is me too!', 'mailVerified': false, 'keyExpiresAt': '2017-08-02T21:22:54.730980Z', 'currentGroup': 1, 'language': 'en', isCurrentUser: false, photoUrls: {} },
  { 'id': 3, 'displayName': 'Karl Karlson', 'email': 'k@k.de', 'unverifiedEmail': 'l@l.de', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.8990022441358, 'longitude': 8.66415739059448, 'description': 'How are you?', 'mailVerified': false, 'keyExpiresAt': '2017-08-02T21:22:54.730980Z', 'currentGroup': 1, 'language': 'de', isCurrentUser: false, photoUrls: {} },
  { 'id': 4, 'displayName': 'Mona Mohnblume', 'email': 'mm@m.de', 'unverifiedEmail': 'm@m.de', 'address': 'Darmstadt, Regierungsbezirk Darmstadt, Hessen, Deutschland', 'latitude': 49.9090022441358, 'longitude': 8.66815739059448, 'description': 'Great to be here!', 'mailVerified': false, 'keyExpiresAt': '2017-08-02T21:22:54.730980Z', 'currentGroup': 1, 'language': 'en', isCurrentUser: false, photoUrls: {} },
]

export const usersMock = [ ...usersMockWithoutCurrent, currentUserMock ]

function convertPlace (place) {
  return {
    ...place,
    saveStatus: statusMocks.default(),
    ui: optionsFor(place),
    group: groupsMock.find(g => g.id === place.group),
  }
}

export const placesMock = [
  { 'id': 1, 'name': 'Teststore1', 'description': 'all the good stuff', 'group': 1, 'address': 'Kranichstein, Darmstadt, Regierungsbezirk Darmstadt, Hesse, Germany', 'latitude': 49.8965397, 'longitude': 8.6847644, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 },
  { 'id': 60, 'name': 'New Tienda', 'description': 'bla bla', 'group': 1, 'address': null, 'latitude': 49.8701892656281, 'longitude': 8.65070343017578, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 },
  { 'id': 56, 'name': 'Supermarkt Arheilgen', 'description': 'blabla', 'group': 1, 'address': 'Frankfurter Landstraße 147 Arheilgen', 'latitude': 49.9105778076202, 'longitude': 8.65834236145019, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 },
  { 'id': 2, 'name': 'asd', 'description': 'asd', 'group': 1, 'address': 'Luisenplatz, Darmstadt, Regierungsbezirk Darmstadt, Hessen, 64283, Deutschland', 'latitude': 49.8728175, 'longitude': 8.65062690796964, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 },
  { 'id': 61, 'name': 'Griesheimer Markt', 'description': 'Frisches Essen dies das', 'group': 1, 'address': 'Griesheim Marktplatz', 'latitude': 49.8615586173026, 'longitude': 8.57465744018555, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 },
].map(convertPlace)

export const placeWithoutLocation = convertPlace({ 'id': 62, 'name': 'Griesheimer Markt 2', 'description': 'Frisches Essen dies das', 'group': 1, 'address': 'Griesheim Marktplatz 1', 'latitude': undefined, 'longitude': undefined, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 })

function enrichPickup (e) {
  e.date = new Date(e.date)
  e.dateEnd = addSeconds(e.date, 1800)
  e.collectors = e.collectors.map(i => usersMock.find(u => u.id === i))
  e.place = placesMock.find(s => e.place === s.id)
  e.saveStatus = statusMocks.default()
  e.joinStatus = statusMocks.default()
  e.leaveStatus = statusMocks.default()
  e.group = groupsMock[0]
  return e
}

export const joinablePickup = enrichPickup({ 'id': 234, 'date': '2017-08-12T08:00:00Z', 'series': 36, 'place': 61, 'maxCollectors': 4, 'collectors': [1, 2, 3], 'description': 'you can join this pickup', isFull: false, isUserMember: false })
export const leavablePickup = enrichPickup({ 'id': 235, 'date': '2017-08-13T08:00:00Z', 'series': 36, 'place': 61, 'maxCollectors': 4, 'collectors': [1, 2, 5], 'description': 'you are collector and can leave this pickup', isFull: false, isUserMember: true })
export const fullPickup = enrichPickup({ 'id': 236, 'date': '2017-08-14T08:00:00Z', 'series': 36, 'place': 61, 'maxCollectors': 4, 'collectors': [1, 2, 3, 4], 'description': 'this pickup is already full!', isFull: true, isUserMember: false })
export const emptyPickup = enrichPickup({ 'id': 237, 'date': '2017-08-15T08:00:00Z', 'series': 36, 'place': 61, 'maxCollectors': 4, 'collectors': [], 'description': 'this pickup is fresh and empty', isFull: false, isUserMember: false, isEmpty: true })

export const pickupsMock = [ joinablePickup, leavablePickup, fullPickup, emptyPickup ]

export const pickupSeriesMock = [
  { 'id': 38, 'maxCollectors': 2, 'place': 2, 'rule': { 'freq': 'WEEKLY', 'byDay': ['TH', 'SU'], 'isCustom': false, 'rule': 'FREQ=WEEKLY;BYDAY=TH,SU' }, 'startDate': new Date('2017-09-17T08:00:00.000Z'), 'description': 'a nice description for the series' },
].map(e => ({
  ...e,
  saveStatus: statusMocks.default(),
  destroyStatus: statusMocks.default(),
}))

export const messagesMock = [
  { 'id': 1, 'author': 1, 'content': 'first messsage', 'conversation': 1, 'createdAt': '2017-08-11T15:43:37.419305Z' },
  { 'id': 2, 'author': 2, 'content': 'second messsage', 'conversation': 1, 'createdAt': '2017-08-11T15:47:06.887669Z' },
  { 'id': 3, 'author': 2, 'content': 'first messsage', 'conversation': 1, 'createdAt': '2017-08-11T15:47:58.078165Z' },
  { 'id': 4, 'author': 2, 'content': 'welcome to fs chat', 'conversation': 1, 'createdAt': '2017-08-11T15:49:27.465728Z' },
  { 'id': 5, 'author': 3, 'content': 'heyo!', 'conversation': 1, 'createdAt': '2017-08-11T15:51:58.770775Z' },
  { 'id': 6, 'author': 2, 'content': 'you made it!', 'conversation': 1, 'createdAt': '2017-08-11T15:52:12.571024Z' },
  { 'id': 7, 'author': 4, 'content': 'amazing!', 'conversation': 1, 'createdAt': '2017-08-11T15:52:24.410671Z' },
  { 'id': 8, 'author': 4, 'content': 'oh let me try something :)', 'conversation': 1, 'createdAt': '2017-08-11T15:52:33.424731Z' },
  { 'id': 9, 'author': 2, 'content': 'I dont think we need to implement another UI, this is fine right? ', 'conversation': 1, 'createdAt': '2017-08-11T15:52:39.970329Z' },
].map(e => {
  e.author = usersMock.find(u => u.id === e.author)
  e.createdAt = new Date(e.createdAt)
  e.reactions = [{ name: 'thumbsup', users: [usersMock[0]], message: `${usersMock[0].displayName} reacted with :thumbsup:` }]
  return e
})

export const feedbackMock = [
  { 'id': 1, 'givenBy': 1, 'comment': 'All worked out perfectly!', 'weight': 2.5, 'about': 234, 'createdAt': '2017-08-11T15:43:37.419305Z' },
  { 'id': 2, 'givenBy': 1, 'comment': '', 'weight': 11, 'about': 235, 'createdAt': '2017-09-11T15:40:37.419305Z' },
  { 'id': 3, 'givenBy': 2, 'comment': 'They did not have anything today', 'weight': 0, 'about': 235, 'createdAt': '2017-09-18T12:12:37.419305Z' },
].map(e => {
  e.givenBy = usersMock.find(u => u.id === e.givenBy)
  e.about = pickupsMock.find(p => p.id === e.about)
  e.createdAt = new Date(e.createdAt)
  return e
})

export const historyMock = [
  { 'id': 4155, 'date': '2017-10-02T09:15:42.484Z', 'typus': 'PICKUP_JOIN', 'group': 1, 'place': 56, 'users': [1], 'payload': { 'description': 'This is default...', 'place': 56, 'id': 1037, 'series': 31, 'maxCollectors': 4, 'date': '2017-10-03T17:00:00.000Z', 'collectors': [1] } },
  { 'id': 4154, 'date': '2017-10-02T09:15:19.072Z', 'typus': 'PICKUP_LEAVE', 'group': 1, 'place': 56, 'users': [2], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [] } },
  { 'id': 4153, 'date': '2017-10-02T09:15:16.568Z', 'typus': 'PICKUP_JOIN', 'group': 1, 'place': 56, 'users': [3], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [3] } },
  { 'id': 4152, 'date': '2017-10-02T09:12:33.954Z', 'typus': 'PICKUP_LEAVE', 'group': 1, 'place': 56, 'users': [4], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [] } },
  { 'id': 4151, 'date': '2017-10-02T09:12:30.903Z', 'typus': 'PICKUP_JOIN', 'group': 1, 'place': 56, 'users': [5], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [5] } },
  { 'id': 4149, 'date': '2017-10-02T08:00:00.000Z', 'typus': 'PICKUP_MISSED', 'group': 1, 'place': 56, 'users': [], 'payload': { 'series': 30, 'pickupDate': 1032, 'maxCollectors': 4 } },
  { 'id': 4147, 'date': '2017-10-01T16:28:04.960Z', 'typus': 'PICKUP_DONE', 'group': 1, 'place': 56, 'users': [1, 2, 3, 4], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [1, 2, 3, 4] } },
  { 'id': 4146, 'date': '2017-10-01T16:28:02.494Z', 'typus': 'PICKUP_LEAVE', 'group': 1, 'place': 56, 'users': [1], 'payload': { 'description': '', 'place': 56, 'id': 1032, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-02T08:00:00.000Z', 'collectors': [] } },
  { 'id': 4145, 'date': '2017-10-01T16:27:57.393Z', 'typus': 'PICKUP_JOIN', 'group': 1, 'place': 56, 'users': [2], 'payload': { 'description': '', 'place': 56, 'id': 1044, 'series': 30, 'maxCollectors': 4, 'date': '2017-10-05T08:00:00.000Z', 'collectors': [22] } },
].map(e => {
  e.date = new Date(e.date)
  e.users = e.users.map(i => usersMock.find(u => u.id === i))
  e.group = groupsMock.find(g => g.id === e.group)
  e.place = placesMock.find(s => s.id === e.place)
  e.message = 'did something'
  return e
})

export const timezones = [
  'Europe/Berlin',
  'Asia/Bangkok',
  'America/Santiago',
  'Europe/Madrid',
]
