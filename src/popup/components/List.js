import { state as mainState } from '../popup.js'
import { div, css, ul, li, button, text, h2 } from '../skruv/html.js'
import { getEnabledSubtitles } from '../utils.js'

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
const toggleItem = (disabled, index) => {
  mainState.subtitles[index].disabled = !disabled
}

const setAll = (state) => {
  mainState.subtitles.forEach(item => {
    item.disabled = state
  })
}

const setRandom = () => {
  mainState.subtitles.forEach(item => {
    item.disabled = Math.random() < 0.5
  })
}

export const List = () => {
  const enabledCards = mainState.subtitles.filter(item => !item.disabled).length

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
          onclick: (e) => {
            toggleItem(item.disabled, i)
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
      `Export ${getEnabledSubtitles(mainState.subtitles).length} cards`
        )
        : text({}, '⚠️ Select at least 1 card')
    )
  )
}
