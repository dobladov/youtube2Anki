
import { body } from './skruv/html.js'
import { createState } from './skruv/state.js'
import { renderNode } from './skruv/vDOM.js'

import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'

export const state = createState({
  view: 'loading',
  activeTabId: null,
  title: null,
  subtitles: null
})

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of state) {
      renderNode(
        body({
          oncreate: (e) => {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
              const activeTab = tabs[0]
              state.activeTabId = activeTab.id

              chrome.tabs.sendMessage(activeTab.id, { type: 'getSubtitles' }, async (response) => {
                const { title, subtitles } = response

                if (title && subtitles) {
                  state.title = title
                  state.subtitles = subtitles
                  state.view = 'list'
                } else {
                  state.view = 'instructions'
                }
              })
            })
          }
        },
        state.view === 'loading' && Loading,
        state.view === 'list' && state.subtitles && List,
        state.view === 'export' && Export,
        state.view === 'instructions' && Instructions
        ),
        document.body
      )
    }
  })()
})

// /**
//  *  Creates a new notification with the given parameters
//  *
//  * @param {string} title
//  * @param {string} message
//  * @param {VoidFunction} callback
//  */
// const sendNotification = (title, message, callback) => {
//   const id = '_' + Math.random().toString(36).substr(2, 9)

//   chrome.notifications.create(id, {
//     type: 'basic',
//     iconUrl: chrome.runtime.getURL('icons/icon128.png'),
//     title,
//     message
//   }, () => {
//     callback && callback()
//   })
// }

// chrome.tabs.sendMessage(activeTab.id, { type: 'getSubtitles' }, async (response) => {
//   const { title, subtitles } = response

//   if (title && subtitles) {
//     console.log(subtitles)

//     const sendToAnkiForm = document.getElementById('sendToAnkiForm')

//     try {
//       await initDecks(title)
//       const connectionMessage = document.getElementById('connectionMessage')

//       deck = document.getElementById('deck')

//       connectionMessage.classList.add('hide')
//       sendToAnkiForm.classList.remove('hide')

//       sendToAnkiForm.addEventListener('submit', async (e) => {
//         e.preventDefault()
//         sendToAnkiForm.classList.add('hide')

//         const selectedDeck = deck.value

//         try {
//           const createDeckResponse = await fetch(`${scheme}://${host}:${port}`,
//             {
//               method: 'POST',
//               body: JSON.stringify({
//                 action: 'createDeck',
//                 version: 6,
//                 params: {
//                   deck: selectedDeck
//                 }
//               })
//             }
//           )

//           const { err } = await createDeckResponse.json()
//           if (err) throw new Error(err)

//           const createModelResponse = await fetch(`${scheme}://${host}:${port}`,
//             {
//               method: 'POST',
//               body: JSON.stringify({
//                 action: 'createModel',
//                 version: 6,
//                 params: {
//                   modelName: 'Youtube2Anki',
//                   inOrderFields: [
//                     'time',
//                     'nextTime',
//                     'text',
//                     'prevText',
//                     'nextText',
//                     'id',
//                     'startSeconds',
//                     'endSeconds',
//                     'title'
//                   ],
//                   css: `
//                         .card {
//                           font-family: futura-pt,sans-serif,sans-serif;
//                           font-size: 20px;
//                           text-align: center;
//                           color: black;
//                           background-color: #e9e9e9;
//                         }

//                         span {
//                           font-size: 0.9rem;
//                           color: #3c3c3c;
//                         }
//                       `,
//                   cardTemplates: [
//                     {
//                       Front: `
//                                 {{title}}
//                                 <br>

//                                 <span>{{prevText}}</span>
//                                 <br>

//                                 {{text}}
//                                 <br>

//                                 <iframe
//                                     width="560"
//                                     height="315"
//                                     src="https://www.youtube.com/embed/{{id}}?start={{startSeconds}}&end={{endSeconds}}&autoplay=1"
//                                     frameborder=0
//                                       autoplay=1
//                                 />

//                                 <br>
//                                 <span>{{time}} - {{nextTime}}</span>
//                                 <br>
//                                 <span>{{nextText}}</span>
//                               `,
//                       Back: `
//                                 {{FrontSide}}
//                                 <hr id=answer>
//                               `
//                     }
//                   ]
//                 }
//               })
//             }
//           )

//           const { errorCreateModel } = await createModelResponse.json()
//           if (errorCreateModel) throw new Error(errorCreateModel)

//           const addNotesResponse = await fetch(`${scheme}://${host}:${port}`,
//             {
//               method: 'POST',
//               body: JSON.stringify({
//                 action: 'addNotes',
//                 version: 6,
//                 params: {
//                   notes: getNotes(subtitles, selectedDeck, 'Youtube2Anki')
//                 }
//               })
//             }
//           )
//           const { error } = await addNotesResponse.json()
//           if (error) throw new Error(error)

//           sendNotification(
//             chrome.i18n.getMessage('extensionName'),
//             chrome.i18n.getMessage('successCreatingCards'),
//             () => window.close()
//           )
//         } catch (error) {
//           sendNotification(
//             chrome.i18n.getMessage('errorSendingCards'),
//             error.message
//           )
//         }
//       })
//     }
//   }
