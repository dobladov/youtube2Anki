let deck

const scheme = 'http'
const host = 'localhost'
const port = 8765

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
 *  Creates a new notification with the given parameters
 *
 * @param {string} title
 * @param {string} message
 * @param {VoidFunction} callback
 */
const sendNotification = (title, message, callback) => {
  const id = '_' + Math.random().toString(36).substr(2, 9)

  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title,
    message
  }, () => {
    callback && callback()
  })
}

/**
 * Set events and logic for the popup
 */
const initPopup = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const activeTab = tabs[0]

    // Initiate subtitles loading
    chrome.tabs.sendMessage(activeTab.id, { type: 'getSubtitles' }, async (response) => {
      const { title, subtitles } = response

      if (title && subtitles) {
        const downloadBtn = document.getElementById('downloadBtn')

        downloadBtn.addEventListener('click', () => {
          chrome.tabs.sendMessage(activeTab.id,
            {
              type: 'download',
              title,
              subtitles
            }
          )
        })

        const sendToAnkiForm = document.getElementById('sendToAnkiForm')

        try {
          await initDecks(title)
          const connectionMessage = document.getElementById('connectionMessage')

          deck = document.getElementById('deck')

          connectionMessage.classList.add('hide')
          sendToAnkiForm.classList.remove('hide')

          sendToAnkiForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            sendToAnkiForm.classList.add('hide')

            const selectedDeck = deck.value

            try {
              const createDeckResponse = await fetch(`${scheme}://${host}:${port}`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    action: 'createDeck',
                    version: 6,
                    params: {
                      deck: selectedDeck
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
                      notes: getNotes(subtitles, selectedDeck, 'Youtube2Anki')
                    }
                  })
                }
              )
              const { error } = await addNotesResponse.json()
              if (error) throw new Error(error)

              sendNotification(
                chrome.i18n.getMessage('extensionName'),
                chrome.i18n.getMessage('successCreatingCards'),
                () => window.close()
              )
            } catch (error) {
              sendNotification(
                chrome.i18n.getMessage('errorSendingCards'),
                error.message
              )
            }
          })
        } catch (error) {
          // Failed to get decks, meaning can't connect to Anki
          console.error(error)
        }
      } else {
        // Transcript was not open or found
        sendNotification(
          chrome.i18n.getMessage('errorTranscriptNotFoundTitle'),
          chrome.i18n.getMessage('errorTranscriptNotFound'),
          () => window.close()
        )
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', function () {
  initPopup()
})
