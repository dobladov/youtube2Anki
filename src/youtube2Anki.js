/**
 * Returns the given milliseconds in seconds
 *
 * @param {string} ms amount of milliseconds
 * @returns {number | undefined}
 */
const toSeconds = (ms) => {
  if (ms) {
    const a = ms.split(':')
    return (+a[0] * 60) + (+a[1])
  }
}

/**
 * Transforms the given object to CSV
 *
 * @param {Object} objArray
 * @returns {string}
 */
const toCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  const str = ''
  return array.reduce((str, next) => {
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
 * Crawl the subtitles frm the YouTube transcript
 *
 * @param {HTMLElement[]} cues
 * @returns {Object}
 */
const getSubtitles = (cues) => {
  return cues.map((cue, i) => {
    const time = cue.querySelector('.cue-group-start-offset').innerText
    const nextTime = (cues[i + 1] &&
      cues[i + 1].querySelector('.cue-group-start-offset').innerText
    ) || null
    const text = cue.querySelector('.cue').innerText
    const prevText = (cues[i - 1] && cues[i - 1].querySelector('.cue').innerText) || null
    const nextText = (cues[i + 1] && cues[i + 1].querySelector('.cue').innerText) || null

    return {
      time,
      nextTime: nextTime || time,
      text,
      prevText,
      nextText,
      id: getID(window.location.href),
      startSeconds: toSeconds(time),
      endSeconds: toSeconds(nextTime) && (toSeconds(nextTime) + 1),
      title: document.querySelector('h1').firstChild.innerText
    }
  })
}

/**
 * Extracts and returns the id of a YouTube url
 *
 * @param {string} url
 * @returns {?string}
 */
const getID = (url) => {
  let ID = ''
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_-]/i)
    ID = ID[0]
  } else {
    ID = url
  }
  return ID
}

/**
 * Listen to messages from popup
 */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const { type } = request

    // Obtains the subtitles from the transcript
    if (type === 'getSubtitles') {
      // // Attempt to open transcripts (incomplete)
      // const btn = document.querySelector('.dropdown-trigger button')
      // btn.click()
      // const menus = document.querySelectorAll('.ytd-menu-service-item-renderer')
      // menus[menus.length - 1].click()

      const cues = [...document.querySelectorAll('.cue-group')]

      if (cues.length) {
        const title = document.querySelector('h1').firstElementChild.innerText
        const subtitles = getSubtitles(cues)
        sendResponse({ title, subtitles })
      } else {
        sendResponse({ subtitles: null, title: null })
      }
    }

    if (type === 'download') {
      const { title, subtitles } = request
      const csv = toCSV(subtitles)
      download(`${title}.csv`, csv)
    }
  }
)
