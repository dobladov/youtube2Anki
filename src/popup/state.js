import { createState } from './skruv-0.7.7/utils/state.js'

/** @type {State} */
export const state = createState({
  view: 'loading',
  title: '',
  subtitles: [],
  deckNames: null,
  error: null,
  activeTabId: NaN,
  mergeStart: NaN,
  mergeEnd: NaN
})

/**
 * @typedef {Object} State
 * @prop {string} view
 * @prop {number} activeTabId - tab to get and send information
 * @prop {string} title - used for the deck name
 * @prop {Subtitle[]} subtitles
 * @prop {string[] | null} deckNames
 * @prop {{message?: string} | null} error
 * @prop {number} mergeStart
 * @prop {number} mergeEnd
 */

/**
 * @typedef {import('../interfaces').Subtitle} Subtitle
 */
