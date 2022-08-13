import { div, css, ul, li, button, text, h2 } from '../skruv/html.js'

import { state as mainState } from '../state.js'
import { getEnabledSubtitles } from '../utils.js'

/**
 * Gets all the cards that will be merged
 * according to the current selection
 */
const getCardsToMerge = () => {
  if (isNaN(mainState.mergeStart) || isNaN(mainState.mergeEnd)) {
    return []
  }

  if (mainState.mergeStart <= mainState.mergeEnd) {
    return mainState.subtitles
      .slice(mainState.mergeStart, mainState.mergeEnd + 1)
      .map(v => ({ ...v }))
  }

  return mainState.subtitles
    .slice(mainState.mergeEnd, mainState.mergeStart + 1)
    .map(v => ({ ...v }))
}

/**
 * Generates a single card from cardsToMerge
 * and replaces it in the subtitles state
 *
 * @param {Subtitle[]} cardsToMerge
 */
const mergeCards = (cardsToMerge) => {
  const lastCard = cardsToMerge[cardsToMerge.length - 1]
  const card = {
    ...cardsToMerge[0],
    text: cardsToMerge.map(({ text }) => text).join(' '),
    endSeconds: lastCard.endSeconds,
    nextTime: lastCard.nextTime,
    nextText: lastCard.nextText
  }

  // Insert the new card in between the selection indexes
  if (mainState.mergeStart < mainState.mergeEnd) {
    mainState.subtitles = [
      ...mainState.subtitles.slice(0, mainState.mergeStart),
      card,
      ...mainState.subtitles.slice(mainState.mergeEnd + 1, mainState.subtitles.length)
    ];

    /** @type {HTMLElement} */(document.querySelector(`[data-index="${mainState.mergeStart}"]`))?.scrollIntoView({ behavior: 'smooth' })
  } else {
    mainState.subtitles = [
      ...mainState.subtitles.slice(0, mainState.mergeEnd),
      card,
      ...mainState.subtitles.slice(mainState.mergeStart + 1, mainState.subtitles.length)
    ];

    /** @type {HTMLElement} */(document.querySelector(`[data-index="${mainState.mergeEnd}"]`))?.scrollIntoView({ behavior: 'smooth' })
  }

  // Reset selection
  mainState.mergeStart = NaN
  mainState.mergeEnd = NaN
}

// @ts-ignore
const styling = css`
  .container  {
    display: flex;
    flex-direction: column;
    max-height: 500px;
    padding-right: 0;
    align-items: center;
    padding: 10px 0;
    gap: 0.5rem;
  }

  .controls {
    display: flex;
    gap: .4rem;
    align-items: center;
    font-size: 1rem;
    width: 100%;
    padding: 0 .5rem;
  }

  .controls .btn {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .controls h2 {
    flex: 1;
    text-align: center;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-x: auto;
  }
  
  li {
    position: relative;
  }

  .text {
    padding: 10px;
    flex: 1;
    text-align: center;
  }

  .disabled {
    text-decoration: line-through;
  }

  .listButton {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0;
    padding: 10px;
    border: none;
    background: transparent;
    outline: none;
    transition: background .2s ease-in-out;
  }

  .listButton:focus {
    background-color: var(--main-bg-color);
    box-shadow: inset 0 0 0 2px var(--action-color);
    border-radius: 4px;
    z-index: 2;
  }

  .inRange {
    background-color: var(--action-disabled-color) !important;
    cursor: copy;
  }

  li:focus-within .floating {
    opacity: 1;
    pointer-events: all;
  }

  .floating {
    padding: .3rem 1rem;
    pointer-events: none;
    opacity: 0;
    z-index: 3;
    position: absolute;
    bottom: -0.5rem;
  }

  .left {
    left: 0.5rem;
  }

  .right {
    right: 0.5rem;
  }

  .hidden {
    transition: opacity .5s ease-in-out;
    pointer-events: none;
    opacity: 0 !important;
  }

  .reset {
    position: absolute;
    left: 50%;
    top: .2rem;
    border: none;
    background: none;
    color: var(--p-color);
    transform: translateX(-50%);
    font-size: .7rem;
  }

  .reset:hover {
    color: var(--action-color);
  }

  .selectBtn {
    padding-top: .2rem;
    padding-bottom: .2rem;
  }
`

/**
 * Toggle the item between enabled and disabled
 *
 * @param {number} index
 */
const toggleItem = (index) => {
  const currentValue = mainState.subtitles[index].disabled
  mainState.subtitles[index].disabled = !currentValue
}

/**
 * Sets all items a enabled/disabled
 *
 * @param {boolean} state
 */
const setAll = (state) => {
  mainState.subtitles.forEach(item => {
    item.disabled = state
  })
}

/**
 * Makes disabled property of all items random
 */
const setRandom = () => {
  mainState.subtitles.forEach(item => {
    item.disabled = Math.random() < 0.5
  })
}

/**
 *
 * @param {string} storageId
 */
export const List = (storageId) => {
  // const enabledCards = mainState.subtitles.filter(item => !item.disabled).length
  const enabledCards = getEnabledSubtitles(mainState.subtitles).length
  const cardsToMerge = getCardsToMerge()

  return div(
    {
      class: 'container card'
    },
    div(
      {
        class: 'controls'
      },
      h2({}, chrome.i18n.getMessage('listSelect')),
      button({
        disabled: enabledCards === mainState.subtitles.length,
        class: 'btn selectBtn',
        onclick: () => setAll(false)
      }, chrome.i18n.getMessage('listSelectAll')),
      button({
        class: 'btn selectBtn',
        disabled: enabledCards === 0,
        onclick: () => setAll(true)
      }, chrome.i18n.getMessage('listSelectNone')),
      button({
        class: 'btn selectBtn',
        onclick: setRandom
      }, chrome.i18n.getMessage('listSelectRandom'))
    ),
    ul({},
      mainState.subtitles.map((item, i) => (
        li({
          class: !!item.disabled && 'disabled'
        },
        button({
          onmouseover: (/** @type {{target: HTMLElement}}} */event) => {
            event.target.focus()
            // Select card for merge end if merge is started
            if (!isNaN(mainState.mergeStart)) {
              mainState.mergeEnd = i
            }
          },
          onfocus: () => {
            // Select card for merge with keyboard
            if (!isNaN(mainState.mergeStart)) {
              mainState.mergeEnd = i
            }
          },
          'data-index': i,
          class: `listButton${cardsToMerge.some(card => card.hash === item.hash) ? ' inRange' : ''}`,
          onclick: () => {
            toggleItem(i)
          }
        },
        div({},
          item.time
        ),
        div({
          class: 'text'
        },
        item.text
        ),
        div({},
          item.nextTime
        )),
        button({
          class: 'btn floating left',
          onclick: () => {
            if (isNaN(mainState.mergeStart)) {
              mainState.mergeStart = i
            } else {
              mainState.mergeStart = NaN
              mainState.mergeEnd = NaN
            }
          }
        }, isNaN(mainState.mergeStart) ? chrome.i18n.getMessage('listMerge') : chrome.i18n.getMessage('listMergeStop')),
        button({
          class: `btn floating right${cardsToMerge.length > 1 ? '' : ' hidden'}`,
          onclick: () => {
            mergeCards(cardsToMerge)
          }
        }, chrome.i18n.getMessage('listMergeCards', String(cardsToMerge.length))))
      )),
      styling
    ),
    div({},
      enabledCards
        ? button(
          {
            disabled: enabledCards === 0,
            class: 'btn',
            onclick: () => {
              mainState.view = 'export'
            }
          },
          chrome.i18n.getMessage('listExportCards', String(enabledCards)))
        : text({}, chrome.i18n.getMessage('listExportCardsMinimum'))
    ),
    button({
      class: 'reset',
      title: chrome.i18n.getMessage('listDeleteSavedCards'),
      onclick: () => {
        // Remove the storage and force a reload
        chrome.tabs.sendMessage(mainState.activeTabId, { type: 'clearSubtitles', storageId }, async () => {
          location.reload()
        })
      }
    }, chrome.i18n.getMessage('listDeleteSavedCards'))
  )
}
