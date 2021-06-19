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
