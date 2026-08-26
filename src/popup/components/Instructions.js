import { elementFactory } from '../skruv-0.7.7/skruv.js'

const { div, h2, p, img, picture, source } = elementFactory
import { css } from '../skruv-0.7.7/utils/css.js'

// @ts-ignore
const style = css`
  img {
    max-width: 100%;
  }
`

export const Instructions = () => div({ class: style },
  h2({}, chrome.i18n.getMessage('instructionsTitle')),
  p({}, chrome.i18n.getMessage('instructionsDescription')),
  picture(
    {},
    source({
      srcset: chrome.runtime.getURL('instructions/openTranscript.avif'),
      type: 'image/avif'
    }),
    source({
      srcset: chrome.runtime.getURL('instructions/openTranscript.webp'),
      type: 'image/webp'
    }),
    img({
      src: chrome.runtime.getURL('instructions/openTranscript.png')
    })
  )
)
