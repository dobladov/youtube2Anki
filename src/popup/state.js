import { createState } from './skruv/state.js'

/** @type {State} */
export const state = createState({
  view: 'loading',
  title: null,
  captions: null,
  subtitles: null,
  deckNames: null,
  error: null,
  activeTabId: null,
  mergeStart: NaN,
  mergeEnd: NaN
})

/**
 * @typedef {Object} State
 * @prop {string} view
 * @prop {number} activeTabId - tab to get and send information
 * @prop {string} title - used for the deck name
 * @prop {Subtitle[]} subtitles
 * @prop {Caption[]} captions
 * @prop {string[]} deckNames
 * @prop {{message?: string}} error
 * @prop {number} mergeStart
 * @prop {number} mergeEnd
 */

/**
 * @typedef {import('../interfaces').Subtitle} Subtitle
 * @typedef {import('../interfaces').Caption} Caption
 */
