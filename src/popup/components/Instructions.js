import { div, h2, p, img, css, picture, source } from '../skruv/html.js'

// @ts-ignore
const style = css`
  img {
    max-width: 100%;
  }
`

export const Instructions = () => div({},
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
  ),
  style
)
