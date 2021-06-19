import { createState } from './skruv/state.js'

export const state = createState({
  view: 'loading',
  activeTabId: null,
  title: null,
  subtitles: null,
  deckNames: null,
  error: {}
})
