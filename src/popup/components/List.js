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
    gap: 10px;
  }

  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 1rem;
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
    border-bottom: 1px solid var(--main-bg-color);
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
    z-index: 99;
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

export const List = () => {
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
      h2({}, 'Select'),
      button({
        disabled: enabledCards === mainState.subtitles.length,
        class: 'btn',
        onclick: () => setAll(false)
      }, 'All'),
      button({
        class: 'btn',
        disabled: enabledCards === 0,
        onclick: () => setAll(true)
      }, 'None'),
      button({
        class: 'btn',
        onclick: setRandom
      }, 'Random')
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
        }, isNaN(mainState.mergeStart) ? 'Merge' : 'Stop Merge'),
        button({
          class: `btn floating right${cardsToMerge.length > 1 ? '' : ' hidden'}`,
          onclick: () => {
            mergeCards(cardsToMerge)
          }
        }, `Merge ${cardsToMerge.length} cards`))
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
      `Export ${enabledCards} cards`
        )
        : text({}, '⚠️ Select at least 1 card')
    )
  )
}
