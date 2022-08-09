
import { body } from './skruv/html.js'
import { renderNode } from './skruv/vDOM.js'

import { state } from './state.js'
import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // @ts-expect-error Skruv initialization
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of state) {
      renderNode(
        body({
          oncreate: () => {
            // Connect to the page script and request the subtitles
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
              const { id } = tabs[0]

              if (id) {
                state.activeTabId = id
                chrome.tabs.sendMessage(id, { type: 'getSubtitles' }, async (response) => {
                  const { title, subtitles } = response

                  // If no subtitles where found, show the instructions
                  if (title && subtitles) {
                    state.title = title
                    state.subtitles = subtitles
                    state.view = 'list'
                  } else {
                    state.view = 'instructions'
                  }
                })
              }
            })
          }
        },
        // Views of the extension
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
