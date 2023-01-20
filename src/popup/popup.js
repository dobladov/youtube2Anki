
import { body } from './skruv/html.js'
import { renderNode } from './skruv/vDOM.js'

import { state as mainState } from './state.js'

import { About } from './components/About.js'
import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'
import { getId, sendNotification } from './utils.js'
import { ListCaptions } from './components/ListCaptions/index.js'

/**
 * @param {chrome.tabs.Tab} tab
 */
const getTabInfo = (tab) => {
  const { id, url, title } = tab

  const youTubeId = getId(String(url)) || 'Error getting the youTubeId'
  const storageId = `youTube2AnkiSubtitles-${youTubeId}`
  const formattedTitle = String(title).replace('- YouTube', '').trim() || 'Untitled'
  return { id, title: formattedTitle, storageId, youTubeId }
}

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // @ts-expect-error Skruv initialization
    // eslint-disable-next-line no-unused-vars
    for await (const stateItem of mainState) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const { id, storageId, title, youTubeId } = getTabInfo(tabs[0])

        // Store subtitles on changes of state
        const stateSubtitles = [...stateItem?.subtitles?.values() || []].map(v => ({ ...v }))
        if (id && storageId && Boolean(stateSubtitles.length)) {
          chrome.tabs.sendMessage(id, { type: 'storeSubtitles', storageId, subtitles: stateSubtitles })
        }

        renderNode(
          body({
            oncreate: () => {
              // Connect to the page script and request the subtitles
              mainState.title = title

              if (id) {
              // Store subtitles in storage on changes
                mainState.activeTabId = id
                chrome.tabs.sendMessage(id, { type: 'getCaptions' }, async (response) => {
                  const { captions, error } = response || {}
                  if (error) {
                    sendNotification('Error while getting the captions', error.message, () => {
                      window.close()
                    })
                  } else if (!captions.length) {
                    sendNotification('No captions found', "Couldn't find any subtitles for this video", () => {
                      // window.close()
                    })
                  } else {
                    mainState.captions = captions
                    mainState.view = 'listCaptions'
                  }
                })

                // TODO: Deprecated version to get subtitles from UI. Delete when  not in use anymore
                // chrome.tabs.sendMessage(id, { type: 'getSubtitles', title, storageId }, async (response) => {
                //   const { subtitles } = response || {}

                //   // If no subtitles where found, show the instructions
                //   if (subtitles) {
                //     mainState.subtitles = subtitles
                //     mainState.view = 'list'
                //   } else {
                //     mainState.view = 'instructions'
                //   }
                // })
              }
            }
          },
          // Views of the extension
          mainState.view === 'loading' && Loading(),
          mainState.view === 'list' && List(storageId),
          mainState.view === 'listCaptions' && ListCaptions(youTubeId),
          mainState.view === 'export' && Export,
          mainState.view === 'instructions' && Instructions,
          About
          ),
          document.body
        )
      })
    }
  })()
})
