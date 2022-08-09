import { div, css, ul, li, button, text, h2 } from '../skruv/html.js'

import { state as mainState } from '../state.js'
import { getEnabledSubtitles } from '../utils.js'

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
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--main-bg-color);
    cursor: pointer;
    padding: 10px;
  }


  li:hover {
    background-color: var(--main-bg-color);
  }

  .text {
    padding: 10px;
    flex: 1;
    text-align: center;
  }

  .disabled {
    text-decoration: line-through;
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
          class: !!item.disabled && 'disabled',
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
        )
        )
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
