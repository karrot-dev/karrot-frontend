import GroupGalleryCardsLayout from './GroupGalleryCardsLayout'
import GroupGalleryCards from './GroupGalleryCardsUI'
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'

import { createLocalVue } from 'vue-test-utils'

import { groupsMock } from '>/mockdata'

import { mountWithDefaults, mountWithDefaultsAndLocalVue, polyfillRequestAnimationFrame } from '>/helpers'

let loggedOutProps = {
  myGroups: [],
  otherGroups: groupsMock,
  isLoggedIn: false,
  currentGroupId: 0,
  showMyGroups: false,
  expanded: false,
}

let loggedInProps = {
  myGroups: groupsMock.slice(0, 3),
  otherGroups: groupsMock.slice(3),
  isLoggedIn: false,
  currentGroupId: 0,
  showMyGroups: true,
  expanded: false,
}

let loggedOutPropsExpanded = Object.assign({}, loggedOutProps)
loggedOutPropsExpanded.expanded = true

let loggedInPropsExpanded = Object.assign({}, loggedInProps)
loggedInPropsExpanded.expanded = true

polyfillRequestAnimationFrame()

describe('GroupGalleryCardsLayout', () => {
  it('Expanded & Logged Out, clicking Preview', () => {
    const localVue = createLocalVue()
    let wrapper = mountWithDefaultsAndLocalVue(GroupGalleryCardsLayout, localVue, {
      propsData: loggedOutPropsExpanded,
      methods: { replaceWindowHistory: (group) => {} },
    })
    let groupCards = wrapper.findAll(GroupGalleryCard)

    expect(wrapper.findAll(GroupGalleryCards).length).toBe(1)
    expect(wrapper.findAll(GroupPreview).length).toBe(0)
    expect(groupCards.length).toBe(6)

    // click preview button (only button on the cards currently)
    groupCards.at(0).findAll('button').trigger('click')
    expect(groupCards.at(0).emitted().preview).toBeTruthy()
    expect(wrapper.emitted().showPreview).toBeTruthy()

    // check if all cards are closed and preview is open
    localVue.nextTick(() => {
      expect(wrapper.findAll(GroupGalleryCards).length).toBe(1)
      expect(wrapper.findAll(GroupPreview).length).toBe(1)
      groupCards = wrapper.findAll(GroupGalleryCard)
      expect(groupCards.length).toBe(0)

      let closeButtons = wrapper.findAll(GroupPreview).at(0).findAll('.preview-close-button')
      expect(closeButtons.length).toBe(1)
      closeButtons.at(0).trigger('click')

      // check if everything is shown again after preview is closed
      localVue.nextTick(() => {
        groupCards = wrapper.findAll(GroupGalleryCard)
        expect(wrapper.findAll(GroupGalleryCards).length).toBe(1)
        expect(wrapper.findAll(GroupPreview).length).toBe(0)
        expect(groupCards.length).toBe(6)
      })
    })
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
