import { div, h2, li, ul, img, css, button } from '../../skruv/html.js'

import { state as mainState } from '../../state.js'
import { LANGUAGE_FLAGS } from './languageFlags.js'

// @ts-ignore
const style = css`
  img {
    max-width: 100%;
    width: 2rem;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 0.5rem;
  }

  .listBtn {
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 100%;
    background-color: var(--card-bg-color);
    border: none;
    cursor: pointer;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    outline: none;
    border-radius: 5px;
  }

  .listBtn:hover,
  .listBtn:focus {
    background-color: var(--card-bg-hover-color);
    box-shadow: inset 0 0 0 2px var(--action-color);
  }
`
/** @param {number} seconds */
function secondsToHms (seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor(seconds % 3600 / 60)
  const s = Math.floor(seconds % 3600 % 60)

  const hDisplay = h < 10 ? '0' + h : h
  const mDisplay = m < 10 ? '0' + m : m
  const sDisplay = s < 10 ? '0' + s : s

  if (h) {
    return hDisplay + ':' + mDisplay + ':' + sDisplay
  }
  return mDisplay + ':' + sDisplay
}

/** @param {string} s */
const unescape = (s) => {
  return s.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

/**
 *
 * @param {RawCaption[]} captions
 * @param {string} youtubeId
 */
const formatCaptions = (captions, youtubeId) => {
  console.log({ captions })
  return captions.map((caption, i) => {
    const hash = (Math.random() + 1).toString(36).substring(2)

    const startSeconds = caption.start
    const time = secondsToHms(Number(startSeconds))
    const nextTime = captions[i + 1] ? secondsToHms(Number(captions[i + 1].start)) : null
    const text = unescape(caption.text)

    const prevText = captions[i - 1] ? unescape(captions[i - 1].text) : null
    const nextText = captions[i + 1] ? unescape(captions[i + 1].text) : null

    const endSeconds = Math.ceil(Number(startSeconds) + Number(caption.dur) + 1)

    return {
      time,
      nextTime: nextTime || time,
      text,
      prevText,
      nextText,
      id: youtubeId,
      startSeconds: Math.floor(Number(startSeconds)),
      endSeconds,
      title: mainState.title,
      hash
    }
  })
}

/** @param {string} youtubeId */
export const ListCaptions = (youtubeId) => {
  /** @param {Caption} caption  */
  const fetchCaption = (caption) => {
    console.log('Fetching', caption.name.simpleText)

    fetch(caption.baseUrl).then(response => {
      response.text().then(text => {
        // Parse the XMl
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, 'text/xml')
        console.log(caption.baseUrl, xmlDoc)
        const rawCaptions = [...xmlDoc.querySelectorAll('text')].map((t) => {
          const start = t.getAttribute('start')
          const dur = t.getAttribute('dur')
          const text = t.innerHTML

          if (start && dur && text) {
            // Remove empty subtitles
            if (!text.trim()) return null

            return {
              start,
              dur,
              text
            }
          }

          return null
        }).filter(caption => caption !== null)
        console.log(rawCaptions)
        const captions = formatCaptions(rawCaptions, youtubeId)
        console.log(captions)
        // Set the subtitles
        // Change the view
        // TODO: store the captions
        mainState.subtitles = captions
        mainState.view = 'list'
      })
    })
  }

  return div({},
    h2({}, 'Select the language'),
    ul({},
      mainState.captions.map((caption) => {
        const name = caption.name.simpleText
        const trimmedName = name.split(' ')[0].toLowerCase()
        const src = LANGUAGE_FLAGS.find((f) => f.name.toLowerCase().startsWith(trimmedName))?.icon || LANGUAGE_FLAGS[0].icon

        return (
          li({},
            button({
              onclick: () => fetchCaption(caption),
              class: 'listBtn'
              // class: 'btn'
            },
            img({ src }),
            `${name} [${caption.languageCode}]`
            )
          ))
      }),
      style
    )
  )
}

/**
 * @typedef {import('../../../interfaces').Caption} Caption
 * @typedef {import('../../../interfaces').Subtitle} Subtitle
 */

/**
 * @typedef {object} RawCaption
 * @prop {string} start
 * @prop {string} dur
 * @prop {string} text
*/
