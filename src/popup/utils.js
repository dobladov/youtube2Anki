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
 * @param {Record<string, string>[]} subtitles
 * @param {boolean} [clean]
 * @returns {Record<string, string>[]}
 */
export const getEnabledSubtitles = (subtitles, clean) => {
  const enabledSubtitles = subtitles.filter(item => !item.disabled)
  if (clean) {
    return enabledSubtitles.map(subtitle => {
      delete subtitle.disabled
      return subtitle
    })
  } else {
    return enabledSubtitles
  }
}
