/**
 * Enables the extension if the context is YouTube
 *
 * @param {number} id
 * @param {string} url
 */
const enableDisableTab = (id, url) => {
  const re = /(http|https):\/\/(www.)?youtube\.com\\*/
  if (re.test(url)) {
    chrome.action.enable(id)
  } else {
    chrome.action.disable(id)
  }
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [activeTab] = tabs
    const { url, id } = activeTab
    id && url && enableDisableTab(id, url)
  })
})

chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    id && tab?.url && enableDisableTab(id, tab.url)
  }
})
