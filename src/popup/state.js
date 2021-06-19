import { createState } from './skruv/state.js'

/** @type {State} */
export const state = createState({
  view: 'loading',
  activeTadeckNamesId: null,
  title: null,
  subtitles: null,
  deckNames: null,
  error: {}
})

/**
 * @typedef {object} State
 * @prop {string} view
 * @prop {number} activeTabId
 * @prop {string} title
 * @prop {Record<string, string | boolean>[]} subtitles
 * @prop {string[]} deckNames
 * @prop {{message?: string}} error
 */
