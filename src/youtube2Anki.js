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
  // const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
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
  const id = getID(window.location.href)

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
const getID = (url) => {
  const match = url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)(?<id>[^#&?]*).*/)
  return match?.groups?.id
}

/**
 * Listen to messages from popup
 */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  const { type } = request

  // Obtains the subtitles from the transcript
  if (type === 'getSubtitles') {
    // // Attempt to open transcripts (incomplete)
    // const btn = document.querySelector('.dropdown-trigger button')
    // btn.click()
    // const menus = document.querySelectorAll('.ytd-menu-service-item-renderer')
    // menus[menus.length - 1].click()

    const cues = [...document.querySelectorAll('.segment')]

    if (cues.length) {
      const title = document.title.replace('- YouTube', '').trim() || 'Untitled'
      const subtitles = getSubtitles(cues, title)
      sendResponse({ title, subtitles })
    } else {
      sendResponse({ subtitles: null, title: null })
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
 * @typedef {import('./interfaces').Subtitle} Subtitle
 */
