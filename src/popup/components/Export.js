import { elementFactory } from '../skruv-0.7.7/skruv.js'
import { state as mainState } from '../state.js'
import { ExportAnki } from './ExportAnki.js'
import { getEnabledSubtitles, toPlainSubtitles } from '../utils.js'
import { css } from '../skruv-0.7.7/utils/css.js'

const { div, h2, button, p } = elementFactory

// @ts-ignore
const styling = css`
  :scope {
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
    class: styling
  },
  button(
    {
      class: 'btn',
      onclick: () => {
        mainState.view = 'list'
      }
    }, chrome.i18n.getMessage('exportEditCards')
  ),
  ExportAnki(),
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
            subtitles: getEnabledSubtitles(toPlainSubtitles(mainState.subtitles))
          }
        )
      }
    }, chrome.i18n.getMessage('exportExportDownload'))
  )
)
