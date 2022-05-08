import { mount } from '@vue/test-utils'
import { nextTicks } from '>/helpers'
import createMockModules from '>/createMockModules'

const mockJoin = jest.fn()

jest.mock('@/group/api/groups', () => ({
  join: mockJoin,
}))

jest.mock('@/router', () => {
  const { createRouter, createMemoryHistory } = require('vue-router')
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      // we always need these routes as we often redirect to them immediately
      {
        name: 'landing',
        path: '/welcome',
        component: {
          template: '<div>landing</div>',
        },
      },
      {
        name: 'groupsGallery',
        path: '/groupPreview',
        component: {
          template: '<div>gallery</div>',
        },
      },
      {
        path: '/',
        component: {
          template: '<div>root</div>',
        },
      },
    ],
  })
})

jest.mock('@/groupInfo/components/GroupPreviewUI', () => ({
  name: 'GroupPreviewUI',
  props: ['group', 'isLoggedIn', 'user', 'application'],
  methods: {
    visit () {
      this.$emit('go-visit', this.group.id)
    },
    join () {
      this.$emit('join', this.group.id)
    },
  },
  template: '<div>A mocked GroupPreviewUI</div>',
}))

function mountRouterViewWith ({ datastore, router }) {
  const i18n = require('@/base/i18n')
  const { i18nPlugin } = i18n

  i18n.locale = 'en'

  return mount({
    template: '<router-view/>',
  }, {
    global: {
      plugins: [
        router,
        datastore,
        i18nPlugin,
      ],
    },
  })
}

function loadMainRoute (name) {
  const routes = require('./main').default
  return routes.find(route => route.name === name)
}

describe('main routes', () => {
  let router
  let datastore
  let mockModules
  let wrapper
  let routedPaths
  let user

  beforeEach(() => { router = require('@/router') })

  beforeEach(() => window.history.pushState(window.history.state, 'home', '#/')) // always reset location or tests will interfere

  beforeEach(async () => {
    const { createStore } = require('vuex')
    user = { id: getRandomId() }
    mockModules = createMockModules({ user })
    datastore = createStore({
      modules: {
        ...mockModules,
        groups: require('@/groupInfo/datastore/groups').default,
        routeMeta: require('@/base/datastore/routeMeta').default,
      },
      plugins: [require('@/base/datastore/routerPlugin').default],
    })

    routedPaths = []
    router.beforeEach(to => routedPaths.push(to.path))

    await router.push({ name: 'groupsGallery' })
  })

  afterEach(() => {
    expect(mockModules.routeError.actions.set).not.toBeCalled()
  })

  describe('groupPreview', () => {
    let group

    beforeEach(() => {
      router.addRoute(loadMainRoute('groupPreview'))
      router.addRoute({
        name: 'group',
        path: '/group/:groupId',
        component: {
          template: '<div>group</div>',
        },
      })
      group = {
        id: getRandomId(),
        name: 'some group name',
        members: [],
      }
      datastore.commit('groups/set', [group])
    })

    it('lets you join the group', async () => {
      await router.push({ name: 'groupPreview', params: { groupPreviewId: group.id } })
      await router.isReady()

      wrapper = mountRouterViewWith({ datastore, router })

      const ui = wrapper.findComponent({ name: 'GroupPreviewUI' })
      expect(ui).toBeDefined()
      ui.vm.join() // trigger the join

      await nextTicks(10)

      expect(mockJoin).toBeCalledWith(group.id)

      expect(routedPaths).toEqual([
        '/groupPreview',
        `/groupPreview/${group.id}`,
        `/group/${group.id}`,
      ])
    })

    it.skip('lets you visit the group', async () => {
      // TODO fix or remove test
      await router.push({ name: 'groupPreview', params: { groupPreviewId: group.id } })
      await router.isReady()

      wrapper = mountRouterViewWith({ datastore, router })

      const ui = wrapper.findComponent({ name: 'GroupPreviewUI' })
      expect(ui).toBeDefined()
      ui.vm.visit()

      await nextTicks(10)

      expect(routedPaths).toEqual([
        '/groupPreview',
        `/groupPreview/${group.id}`,
        `/group/${group.id}`,
      ])

      // note: it did not actually check if we were a member of the group
    })
  })
})

function getRandomId () {
  return getRandomInt(0, 1000)
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.realRandom() * (max - min)) + min
}
