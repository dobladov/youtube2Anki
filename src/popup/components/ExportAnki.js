import { div, h2, button, p, text, a, datalist, form, input, option, br, label } from '../skruv/html.js'

import { state as mainState } from '../state.js'
import { sendNotification, getEnabledSubtitles } from '../utils.js'

const scheme = 'http'
const host = 'localhost'
const port = 8765

/**
 * Format the subtitles for Anki
 *
 * @param {Subtitle[]} subtitles
 * @param {string} deck
 * @param {string} model
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
        title: subtitle.title,
        hash: subtitle.hash
      },
      tags: [],
      options: {
        allowDuplicate: false
      }
    }
  ))
)

/**
 * Obtains deck names form Anki
 * and stores them in the state
 *
 * @param {string} title
 */
const initDecks = async (title) => {
  try {
    const { result: decks } = await (await fetch(`${scheme}://${host}:${port}`,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'deckNames',
          version: 6
        })
      }
    )).json()

    // Add the title if it does not exist as a deck in Anki
    if (!decks.includes(title)) {
      decks.push(title)
    }

    mainState.deckNames = decks.filter(Boolean)
  } catch (error) {
    console.warn(error)
    mainState.error = {
      message: '⚠️ It\'s not possible to connect with Anki, make sure it\'s running'
    }
  }
}

/**
 * Creates a new deck in Anki with the given name
 *
 * @param {string} deckName
 */
const createDeck = async (deckName) => {
  const createDeckResponse = await fetch(`${scheme}://${host}:${port}`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'createDeck',
        version: 6,
        params: {
          deck: deckName
        }
      })
    }
  )

  const { err } = await createDeckResponse.json()
  if (err) throw new Error(err)
}

/**
 * Creates the model in which the cards will be represented
 */
const createModel = async () => {
  const createModelResponse = await fetch(`${scheme}://${host}:${port}`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'createModel',
        version: 6,
        params: {
          modelName: 'Youtube2AnkiV2',
          inOrderFields: [
            'time',
            'nextTime',
            'text',
            'prevText',
            'nextText',
            'id',
            'startSeconds',
            'endSeconds',
            'title',
            'hash'
          ],
          css: `
              .card {
                font-family: futura-pt,sans-serif,sans-serif;
                font-size: 20px;
                text-align: center;
                color: black;
                background-color: #e9e9e9;
              }

              span {
                font-size: 0.9rem;
                color: #3c3c3c;
              }
            `,
          cardTemplates: [
            {
              Front: `
                      {{title}}
                      <br>

                      <span>{{prevText}}</span>
                      <br>

                      {{text}}
                      <br>

                      <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/{{id}}?start={{startSeconds}}&end={{endSeconds}}&autoplay=1"
                          frameborder=0
                            autoplay=1
                      />

                      <br>
                      <span>{{time}} - {{nextTime}}</span>
                      <br>
                      <span>{{nextText}}</span>
                    `,
              Back: `
                      {{FrontSide}}
                      <hr id=answer>
                    `
            }
          ]
        }
      })
    }
  )

  const { errorCreateModel } = await createModelResponse.json()
  if (errorCreateModel) throw new Error(errorCreateModel)
}

/**
 * Adds the given notes to the deck
 *
 * @param {Subtitle[]} notes
 * @param {string} deckName
 */
const addNotes = async (notes, deckName) => {
  const addNotesResponse = await fetch(`${scheme}://${host}:${port}`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'addNotes',
        version: 6,
        params: {
          notes: getNotes(notes, deckName, 'Youtube2AnkiV2')
        }
      })
    }
  )
  const { error } = await addNotesResponse.json()
  if (error) throw new Error(error)
}

/**
 * Component that handles Connection to Anki
 */
export const ExportAnki = () => div(
  {
    class: 'card',
    oncreate: async () => {
      await initDecks(mainState.title)
    }
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
  mainState.error?.message && p({}, mainState.error.message),
  mainState.error?.message && button({
    class: 'btn',
    onclick: async () => {
      mainState.error = {}
      await initDecks(mainState.title)
    }
  },
  'Reconnect'
  ),
  mainState.deckNames &&
      form(
        {
          onsubmit: async (/** @type {Event} */e) => {
            e.preventDefault()
            // @ts-ignore
            const formData = new FormData(e.target)
            const deckName = /** @type {string} */(formData.get('deckName'))

            try {
              const subtitles = getEnabledSubtitles(mainState.subtitles)

              await createDeck(deckName)
              await createModel()
              await addNotes(subtitles, deckName)

              sendNotification(
                '✅ Success',
                `Added ${subtitles.length} new cards`,
                () => window.close()
              )
            } catch (error) {
              console.error(error)
              sendNotification(
                '⚠️ Error creating the cards',
                // @ts-expect-error
                error.message
              )
            }
          }
        },
        label({ for: 'deckName' }, 'Deck Name'),
        input({
          id: 'deckName',
          name: 'deckName',
          type: 'text',
          required: true,
          list: 'deckList',
          value: mainState.title
        }),
        datalist({
          id: 'deckList'
        }, mainState.deckNames.map(name => option({
          value: name
        }, name))),
        br({}),
        br({}),
        button({
          type: 'submit',
          class: 'btn'
        }, 'Send')
      )
)

/**
 * @typedef {import('../../interfaces').Subtitle} Subtitle
 */
