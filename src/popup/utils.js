/**
 *  Creates a new notification with the given parameters
 *
 * @param {string} title
 * @param {string} message
 * @param {VoidFunction} [callback]
 */
export const sendNotification = (title, message, callback) => {
  const id = '_' + Math.random().toString(36).substr(2, 9)

  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title,
    message
  }, () => {
    callback && callback()
  })
}

/**
 * Gives only the subtitles that are enabled
 *
 * @param {Subtitle[]} subtitles
 */
export const getEnabledSubtitles = (subtitles) => {
  return subtitles.filter(item => !item.disabled)
}

/**
 * Extracts and returns the id of a YouTube url
 *
 * @param {string} url
 */
export const getId = (url) => {
  const match = url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)(?<id>[^#&?]*).*/)
  return match?.groups?.id
}

/**
 * @typedef {import('../interfaces').Subtitle} Subtitle
 */
