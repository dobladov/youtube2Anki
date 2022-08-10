
import { body } from './skruv/html.js'
import { renderNode } from './skruv/vDOM.js'

import { state } from './state.js'
import { About } from './components/About.js'
import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'
import { getId } from './utils.js'

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // @ts-expect-error Skruv initialization
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of state) {
      // Store subtitles in storage on changes
      const subs = [...stateItem?.subtitles?.values() || []].map(v => Object.assign({}, Object.assign({}, v)))
      if (state.storageId && Boolean(subs.length)) {
        const storageId = `youtube2AnkiSubtitles-${state.storageId}`
        localStorage.setItem(storageId, JSON.stringify(subs))
      }

      // Delete storage with a value older than x
      renderNode(
        body({
          oncreate: () => {
            // Connect to the page script and request the subtitles
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
              const { id, url, title } = tabs[0]

              // Store the Id and
              const youTubeId = getId(String(url))
              state.storageId = String(youTubeId)
              state.title = String(title).replace('- YouTube', '').trim() || 'Untitled'

              if (id) {
                state.activeTabId = id
                // Get subtitles form the storage
                const storedSubtitles = JSON.parse(localStorage.getItem(state.storageId) || '[]')

                if (storedSubtitles.length) {
                  state.subtitles = storedSubtitles
                  state.view = 'list'
                } else {
                  chrome.tabs.sendMessage(id, { type: 'getSubtitles', title }, async (response) => {
                    const { subtitles } = response

                    // If no subtitles where found, show the instructions
                    if (subtitles) {
                      state.subtitles = subtitles
                      state.view = 'list'
                    } else {
                      state.view = 'instructions'
                    }
                  })
                }
              }
            })
          }
        },
        // Views of the extension
        state.view === 'loading' && Loading,
        state.view === 'list' && state.subtitles && List,
        state.view === 'export' && Export,
        state.view === 'instructions' && Instructions,
        About
        ),
        document.body
      )
    }
  })()
})
