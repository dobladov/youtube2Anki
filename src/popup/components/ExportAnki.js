import { state as mainState } from '../popup.js'
import { div, h2, button, p, text, a, datalist, form, input, option, br } from '../skruv/html.js'

const scheme = 'http'
const host = 'localhost'
const port = 8765

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

/**
 * Obtain deck names form Anki
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

    console.log(decks)

    if (!decks.includes(mainState.title)) {
      decks.push(mainState.title)
    }

    mainState.deckNames = decks.filter(Boolean)
  } catch (error) {
    console.log(error)

    mainState.error = {
      type: 'connection',
      message: 'Can\'t connect to Anki'
    }
  }
}

export const ExportAnki = () => div(
  {
    class: 'card',
    oncreate: async () => {
      await initDecks()
    }
  },
  h2({}, 'Send to Anki'),
  p({},
    text({}, 'Use '),
    a({
      href: 'https://ankiweb.net/shared/info/2055492159',
      target: '_blank'
    }, 'Anki Connect'),
    text({}, ' to add cards directly to a deck'),
    mainState.error && p({}, mainState.error.message)
  ),
  // pre({}, JSON.stringify(mainState, null, 2)),
  mainState.deckNames &&
      form(
        {
          onsubmit: async (e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const deckName = formData.get('deckName')

            try {
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

              const createModelResponse = await fetch(`${scheme}://${host}:${port}`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    action: 'createModel',
                    version: 6,
                    params: {
                      modelName: 'Youtube2Anki',
                      inOrderFields: [
                        'time',
                        'nextTime',
                        'text',
                        'prevText',
                        'nextText',
                        'id',
                        'startSeconds',
                        'endSeconds',
                        'title'
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

              const addNotesResponse = await fetch(`${scheme}://${host}:${port}`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    action: 'addNotes',
                    version: 6,
                    params: {
                      notes: getNotes(mainState.subtitles, deckName, 'Youtube2Anki')
                    }
                  })
                }
              )
              const { error } = await addNotesResponse.json()
              if (error) throw new Error(error)

              console.log('Success created and shit')
            } catch (error) {
              console.log(error)
              console.log('Can\'t send the cards')
            }
          }
        },
        input({
          name: 'deckName',
          type: 'text',
          required: true,
          placeholder: 'Deck Name',
          list: 'deckList'
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
