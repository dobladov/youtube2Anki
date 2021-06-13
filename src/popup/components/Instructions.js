import { div, h2, p, img, css } from '../skruv/html.js'

const style = css`
  img {
    max-width: 450px;
  }
`

export const Instructions = () => div({},
  h2({}, 'Transcript not found'),
  p({}, 'Please, open the transcript of the video'),
  img({ src: chrome.runtime.getURL('instructions/openTranscript.png') }),
  style
)
