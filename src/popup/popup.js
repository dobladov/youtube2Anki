
import { body } from './skruv/html.js'
import { renderNode } from './skruv/vDOM.js'

import { state } from './state.js'
import { About } from './components/About.js'
import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'
import { getId } from './utils.js'

/**
 * @param {chrome.tabs.Tab} tab
 */
const getTabInfo = (tab) => {
  const { id, url, title } = tab

  const youTubeId = getId(String(url))
  const storageId = `youTube2AnkiSubtitles-${youTubeId}`
  const formattedTitle = String(title).replace('- YouTube', '').trim() || 'Untitled'
  return { id, title: formattedTitle, storageId }
}

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // @ts-expect-error Skruv initialization
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of state) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const { id, storageId, title } = getTabInfo(tabs[0])

        // Get subtitles from storage proxy
        const stateSubtitles = [...stateItem?.subtitles?.values() || []].map(v => ({ ...v }))
        if (id && storageId && Boolean(stateSubtitles.length)) {
          chrome.tabs.sendMessage(id, { type: 'storeSubtitles', storageId, subtitles: stateSubtitles })
        }

        renderNode(
          body({
            oncreate: () => {
              // Connect to the page script and request the subtitles
              state.title = title

              if (id) {
              // Store subtitles in storage on changes
                state.activeTabId = id
                chrome.tabs.sendMessage(id, { type: 'getSubtitles', title, storageId }, async (response) => {
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
      })
    }
  })()
})
