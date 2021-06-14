
import { body } from './skruv/html.js'
import { createState } from './skruv/state.js'
import { renderNode } from './skruv/vDOM.js'

import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'

export const state = createState({
  view: 'export',
  activeTabId: null,
  title: null,
  subtitles: null,
  deckNames: ['foo', 'bar'],
  error: null
})

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of state) {
      renderNode(
        body({
          // oncreate: (e) => {
          //   chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          //     const activeTab = tabs[0]
          //     state.activeTabId = activeTab.id

          //     chrome.tabs.sendMessage(activeTab.id, { type: 'getSubtitles' }, async (response) => {
          //       const { title, subtitles } = response

          //       if (title && subtitles) {
          //         state.title = title
          //         state.subtitles = subtitles
          //         state.view = 'list'
          //       } else {
          //         state.view = 'instructions'
          //       }
          //     })
          //   })
          // }
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
