
import { body } from './skruv/html.js'
import { renderNode } from './skruv/vDOM.js'

import { state as mainState } from './state.js'

import { About } from './components/About.js'
import { Export } from './components/Export.js'
import { List } from './components/List.js'
import { Instructions } from './components/Instructions.js'
import { Loading } from './components/Loading.js'
import { getId } from './utils.js'
import { ListCaptions } from './components/ListCaptions/index.js'

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
    for await (const stateItem of mainState) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const { id, storageId, title } = getTabInfo(tabs[0])

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
                chrome.tabs.sendMessage(id, { type: 'getCaptionsUrls' }, async (response) => {
                  const { captionUrls } = response || {}
                  if (captionUrls) {
                    mainState.captionUrls = captionUrls
                    mainState.view = 'listCaptions'
                  } else {
                    mainState.view = 'instructions'
                  }
                })
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
          mainState.view === 'listCaptions' && ListCaptions(),
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
