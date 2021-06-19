import { state as mainState } from '../popup.js'
import { div, css, h2, button, p } from '../skruv/html.js'
import { ExportAnki } from './ExportAnki.js'
import { getEnabledSubtitles } from '../utils.js'

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
    }, 'Edit cards'
  ),
  ExportAnki,
  div(
    {
      class: 'card'
    },
    h2({}, 'Export'),
    p({}, 'Export the transcript as a CSV file'),
    button({
      class: 'btn',
      onclick: () => {
        chrome.tabs.sendMessage(mainState.activeTabId,
          {
            type: 'download',
            title: mainState.title,
            subtitles: getEnabledSubtitles(mainState.subtitles, true)
          }
        )
      }
    }, 'Download')
  ),
  styling
)
