/**
 * Returns the given time string in seconds
 *
 * @param {string} time
 */
const toSeconds = (time) => {
  const [minutes, seconds] = time.split(':')
  return (+minutes * 60) + (+seconds)
}

/**
 * Transforms the given object to CSV
 *
 * @param {Subtitle[]} subtitles
 */
const toCSV = (subtitles) => {
  const str = ''
  return [...subtitles].reduce((str, next) => {
    str += `${Object.values(next).map(value => `"${value}"`).join(',')}` + '\r\n'
    return str
  }, str)
}

/**
 * Starts the download of the given text
 *
 * @param {string} filename
 * @param {string} text
 */
const download = (filename, text) => {
  const link = document.createElement('a')
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text))
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Crawl the subtitles from the YouTube transcript
 *
 * @param {Element[]} cues
 * @param {string} title
 */
const getSubtitles = (cues, title) => {
  const id = getId(window.location.href)

  return cues.map((cue, i) => {
    const time = /** @type {HTMLElement} */(cue.querySelector('.segment-timestamp')).innerText
    const nextTime = (cues[i + 1] &&
    /** @type {HTMLElement} */(cues[i + 1].querySelector('.segment-timestamp')).innerText
    ) || null
    const text = /** @type {HTMLElement} */(cue.querySelector('.segment-text')).innerText
    const prevText = (cues[i - 1] && /** @type {HTMLElement} */(cues[i - 1].querySelector('.segment-text')).innerText) || null
    const nextText = (cues[i + 1] && /** @type {HTMLElement} */(cues[i + 1].querySelector('.segment-text')).innerText) || null
    const endSeconds = nextTime ? toSeconds(nextTime) + 1 : null
    const hash = (Math.random() + 1).toString(36).substring(2)

    return {
      time,
      nextTime: nextTime || time,
      text,
      prevText,
      nextText,
      id,
      startSeconds: toSeconds(time),
      endSeconds,
      title,
      hash
    }
  })
}

/**
 * Extracts and returns the id of a YouTube url
 *
 * @param {string} url
 */
const getId = (url) => {
  const match = url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)(?<id>[^#&?]*).*/)
  return match?.groups?.id
}

/**
 * Listen to messages from popup
 */
chrome.runtime.onMessage.addListener((/** @type {Message} */request, _, sendResponse) => {
  const { type } = request

  // Saves the subtitles on the sessionStorage
  if (type === 'storeSubtitles') {
    sessionStorage.setItem(request.storageId, JSON.stringify(request.subtitles))
  }

  // Obtains the subtitles from the transcript
  if (type === 'getSubtitles') {
    // Get subtitles form the storage
    const storedSubtitles = JSON.parse(sessionStorage.getItem(request.storageId) || '[]')
    if (storedSubtitles.length) {
      sendResponse({ subtitles: storedSubtitles })
      return
    }

    const cues = [...document.querySelectorAll('.segment')]

    if (cues.length) {
      const subtitles = getSubtitles(cues, request.title)
      sendResponse({ subtitles })
    } else {
      sendResponse({ subtitles: null })
    }
  }

  if (type === 'download') {
    /** @type {{title: string, subtitles: Subtitle[]}} */
    const { title, subtitles } = request
    const cleanSubtitles = subtitles.map(({ disabled, ...rest }) => rest)
    const csv = toCSV(cleanSubtitles)
    download(`${title}.csv`, csv)
  }
})

/**
 * @typedef {object} Message
 * @prop {'getSubtitles'| 'storeSubtitles' | 'download'} type
 * @prop {string} title
 * @prop {string} storageId
 * @prop {Subtitle[]} subtitles
 */

/**
 * @typedef {import('./interfaces').Subtitle} Subtitle
 */
