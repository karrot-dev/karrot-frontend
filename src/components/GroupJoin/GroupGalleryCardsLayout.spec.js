import GroupGalleryCardsLayout from './GroupGalleryCardsLayout'
import GroupGalleryCards from './GroupGalleryCards'
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'

import { createLocalVue } from 'vue-test-utils'
import { groupsMock } from '>/mockdata'
import {
  mountWithDefaults,
  mountWithDefaultsAndLocalVue,
  polyfillRequestAnimationFrame,
} from '>/helpers'

const loggedOutProps = {
  filteredMyGroups: [],
  filteredOtherGroups: groupsMock,
  playgroundGroup: undefined,
  isLoggedIn: false,
  currentGroupId: 0,
  hasJoinedGroups: false,
  expanded: false,
  groupForPreview: null,
  search: '',
}

const loggedInProps = {
  filteredMyGroups: groupsMock.slice(0, 3),
  filteredOtherGroups: groupsMock.slice(3),
  playgroundGroup: undefined,
  isLoggedIn: false,
  currentGroupId: 0,
  hasJoinedGroups: true,
  expanded: false,
  groupForPreview: null,
  search: '',
}

const loggedOutPropsExpanded = {
  ...loggedOutProps,
  expanded: true,
}

const loggedInPropsExpanded = {
  ...loggedInProps,
  expanded: true,
}

polyfillRequestAnimationFrame()

describe('GroupGalleryCardsLayout', () => {
  beforeEach(() => jest.resetModules())

  it('Expanded & Logged Out, clicking Preview', async () => {
    const localVue = createLocalVue()
    let wrapper = mountWithDefaultsAndLocalVue(GroupGalleryCardsLayout, localVue, {
      propsData: loggedOutPropsExpanded,
      methods: { replaceWindowHistory: () => {} },
    })
    let groupCards = wrapper.findAll(GroupGalleryCard)

    expect(wrapper.findAll(GroupGalleryCards).length).toBe(1)
    expect(wrapper.findAll(GroupPreview).length).toBe(0)
    expect(groupCards.length).toBe(groupsMock.length)

    // click preview button (only button on the cards currently)
    groupCards.at(0).findAll('button').trigger('click')
    expect(wrapper.emitted().showPreview.length).toBe(1)
    expect(wrapper.emitted().showPreview[0][0].name).toEqual('05_testgroup')
    wrapper.vm.groupForPreview = groupsMock[0]

    // check if all cards are closed and preview is open
    await localVue.nextTick()
    expect(wrapper.findAll(GroupPreview).length).toBe(1)
    expect(wrapper.findAll(GroupGalleryCards).length).toBe(0)
    groupCards = wrapper.findAll(GroupGalleryCard)
    expect(groupCards.length).toBe(0)

    let closeButtons = wrapper.findAll(GroupPreview).at(0).findAll('.preview-close-button')
    expect(closeButtons.length).toBe(1)
    closeButtons.at(0).trigger('click')
    expect(wrapper.emitted().showPreview.length).toBe(2)
    expect(wrapper.emitted().showPreview[1][0]).toEqual(null)
    wrapper.vm.groupForPreview = null

    // check if everything is shown again after preview is closed
    await localVue.nextTick()
    groupCards = wrapper.findAll(GroupGalleryCard)
    expect(wrapper.findAll(GroupGalleryCards).length).toBe(1)
    expect(wrapper.findAll(GroupPreview).length).toBe(0)
    expect(groupCards.length).toBe(groupsMock.length)
  })

  it('Expanded & Logged In', () => {
    let wrapper = mountWithDefaults(GroupGalleryCardsLayout, {
      propsData: loggedInPropsExpanded,
    })
    expect(wrapper.findAll(GroupGalleryCards).length).toBe(2)
    expect(wrapper.findAll(GroupGalleryCard).length).toBe(6)
  })

  it('Not expanded & Logged Out', () => {
    let wrapper = mountWithDefaults(GroupGalleryCardsLayout, {
      propsData: loggedOutProps,
    })
    expect(wrapper.findAll(GroupGalleryCards).length).toBe(0)
    expect(wrapper.findAll(GroupGalleryCard).length).toBe(0)
  })

  it('Not expanded & Logged In', () => {
    let wrapper = mountWithDefaults(GroupGalleryCardsLayout, {
      propsData: loggedInProps,
    })
    expect(wrapper.findAll(GroupGalleryCards).length).toBe(0)
    expect(wrapper.findAll(GroupGalleryCard).length).toBe(0)
  })
})
