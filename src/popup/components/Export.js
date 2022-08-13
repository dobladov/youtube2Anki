import { div, css, h2, button, p } from '../skruv/html.js'

import { state as mainState } from '../state.js'
import { ExportAnki } from './ExportAnki.js'
import { getEnabledSubtitles } from '../utils.js'

// @ts-ignore
const styling = css`
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    padding: 20px;
  }
`

export const Export = () => div(
  {
    class: 'container'
  },
  button(
    {
      class: 'btn',
      onclick: () => {
        mainState.view = 'list'
      }
    }, chrome.i18n.getMessage('exportEditCards')
  ),
  ExportAnki,
  div(
    {
      class: 'card'
    },
    h2({}, chrome.i18n.getMessage('exportExportTitle')),
    p({}, chrome.i18n.getMessage('exportExportDescription')),
    button({
      class: 'btn',
      onclick: () => {
        chrome.tabs.sendMessage(mainState.activeTabId,
          {
            type: 'download',
            title: mainState.title,
            subtitles: getEnabledSubtitles(mainState.subtitles)
          }
        )
      }
    }, chrome.i18n.getMessage('exportExportDownload'))
  ),
  styling
)
