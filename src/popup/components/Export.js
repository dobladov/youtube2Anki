import { state as mainState } from '../popup.js'
import { createState } from '../skruv/state.js'
import { div, css, h2, button, p, text, a } from '../skruv/html.js'

export const state = createState({
  deckNames: null,
  selectedDeck: null,
  error: null
})

const scheme = 'http'
const host = 'localhost'
const port = 8765

const styling = css`
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    padding: 20px;
  }
`

/**
 * Gets the name of the decks created in Anki
 *
 * @param {string} title
 */
const initDecks = async (title) => {
  const decksList = document.getElementById('decksList')
  const deckNamesResponse = await fetch(`${scheme}://${host}:${port}`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'deckNames',
        version: 6
      })
    }
  )
  const decks = await deckNamesResponse.json()
  !decks.result.includes(title) && decks.result.unshift(title)

  decks.result.forEach(name => {
    const option = document.createElement('option')
    option.innerHTML = name
    option.value = name
    decksList.appendChild(option)
  })
}

/**
 * Format the subtitles for Anki
 *
 * @param {Object} subtitles
 * @param {string} deck
 * @param {string} model
 * @returns
 */
const getNotes = (subtitles, deck, model) => (
  subtitles.map(subtitle => (
    {
      deckName: deck,
      modelName: model,
      fields: {
        time: subtitle.time,
        nextTime: subtitle.nextTime || '',
        text: subtitle.text,
        prevText: subtitle.prevText || '',
        nextText: subtitle.nextText || '',
        id: subtitle.id,
        startSeconds: (subtitle.startSeconds && subtitle.startSeconds.toString()) || '',
        endSeconds: (subtitle.endSeconds && subtitle.endSeconds.toString()) || '',
        title: subtitle.title
      },
      tags: [],
      options: {
        allowDuplicate: false
      }
    }
  ))
)

export const Export = () => div(
  {
    class: 'container'
  },
  button(
    {
      class: 'btn',
      onclick: () => {
        mainState.view = 'list'
      }
    }, 'Edit cards'
  ),
  div(
    {
      class: 'card'
    },
    h2({}, 'Send to Anki'),
    p({},
      text({}, 'Use '),
      a({
        href: 'https://ankiweb.net/shared/info/2055492159',
        target: '_blank'
      }, 'Anki Connect'),
      text({}, ' to add cards directly to a deck')
    ),
    button({
      class: 'btn',
      onclick: () => console.log('Send to Anki')
    }, 'Create cards'),
    // deckNames ? , TODO: Implement
    state.error ? '⚠️ Connection not possible, Anki must be running with the addon, try again.' : null
  ),
  div(
    {
      class: 'card'
    },
    h2({}, 'Export'),
    p({}, 'Export the transcript as a CSV file'),
    button({
      class: 'btn',
      onclick: () => {
        chrome.tabs.sendMessage(mainState.activeTabId,
          {
            type: 'download',
            title: mainState.title,
            subtitles: mainState.subtitles.filter(item => !item.disabled)
          }
        )
      }
    }, 'Download')
  ),
  styling
)
